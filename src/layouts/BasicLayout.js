import WaterMarker from '@/components/WaterMarker';
import G6 from '@antv/g6';
import { Layout } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import { enquireScreen } from 'enquire-js';
import pathToRegexp from 'path-to-regexp';
import { useEffect, useState } from 'react';
import { ContainerQuery } from 'react-container-query';
import { Helmet, history, Outlet, useIntl } from 'umi';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import { isUrl, urlToList } from '../utils';
import Header from './Header';
const { Content, Footer } = Layout;
//定义边动画
G6.registerEdge(
    'polyline-running',
    {
        afterDraw(cfg, group) {
            // get the first shape in the group, it is the edge's path here=
            const shape = group.get('children')[0];
            const arrow = group.addShape('marker', {
                attrs: {
                    x: 24,
                    y: 0,
                    r: 12,
                    lineWidth: 2,
                    stroke: edgeColor,
                    // fill: '#fff',
                    symbol: (x, y, r) => {
                        return [
                            ['M', x - 12, y - 6],
                            ['L', x - 2, y],
                            ['L', x - 12, y + 6]
                        ];
                    }
                }
            });
            arrow.toFront();
            // animation for the red circle
            arrow.animate(
                ratio => {
                    // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
                    // get the position on the edge according to the ratio
                    const tmpPoint = shape.getPoint(ratio);
                    const pos = getLabelPosition(shape, ratio);
                    let matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
                    matrix = transform(matrix, [
                        ['t', -tmpPoint.x, -tmpPoint.y],
                        ['r', pos.angle],
                        ['t', tmpPoint.x, tmpPoint.y]
                    ]);
                    // returns the modified configurations here, x and y here
                    return {
                        x: tmpPoint.x,
                        y: tmpPoint.y,
                        matrix
                    };
                },
                {
                    // repeat: true, // Whether executes the animation repeatly
                    duration: 3000, // the duration for executing once
                    callback: () => {
                        arrow.hide();
                    }
                }
            );
        }
    },
    'polyline'
); // 该自定义边继承了内置横向三阶贝塞尔曲线边 polyline
G6.registerNode(
    'rect-title',
    {
        afterDraw(cfg, group) {
            if (cfg.sourceTitle) {
                group.addShape('text', {
                    attrs: {
                        text: cfg.sourceTitle,
                        x: 0,
                        y: cfg.titlePosition == 'top' ? -30 : 40,
                        fontSize: 14,
                        fill: NodeColor[1],
                        textAlign: 'center'
                    }
                });
            }
            if (cfg.targetTitle) {
                group.addShape('text', {
                    attrs: {
                        text: cfg.targetTitle,
                        x: 0,
                        y: cfg.titlePosition == 'top' ? -43 : 53,
                        fontSize: 14,
                        fill: NodeColor[3],
                        textAlign: 'center'
                    }
                });
            }
        }
    },
    'rect'
);
G6.registerNode(
    'img-title',
    {
        afterDraw(cfg, group) {
            if (cfg.sourceTitle) {
                group.addShape('text', {
                    attrs: {
                        text: cfg.sourceTitle,
                        x: 0,
                        y: cfg.titlePosition == 'top' ? -30 : 40,
                        fontSize: 14,
                        fill: NodeColor[1],
                        textAlign: 'center'
                    }
                });
            }
            if (cfg.targetTitle) {
                group.addShape('text', {
                    attrs: {
                        text: cfg.targetTitle,
                        x: 0,
                        y: cfg.titlePosition == 'top' ? -43 : 53,
                        fontSize: 14,
                        fill: NodeColor[3],
                        textAlign: 'center'
                    }
                });
            }
        }
    },
    'image'
);
//矩形动画
G6.registerNode(
    'rect-animate',
    {
        afterDraw(cfg, group) {
            let rect = group.getChildren()[0];
            console.log(group, 'animate', cfg);
            const rate = 3;
            function fade(ratio) {
                //显
                let r = 239 + (255 - 239) * ratio;
                let g = 244 * (1 - ratio * rate);
                let b = 255 * (1 - ratio * rate);
                return `rgb(${r},${g},${b})`;
            }
            function fadeOut(ratio) {
                //隐
                let r = 255 - (255 - 239) * ratio;
                let g = 244 * ratio * rate;
                let b = 255 * ratio * rate;
                return `rgb(${r},${g},${b})`;
            }
            rect.animate(
                ratio => {
                    const t = 1 / 3;
                    let rgb = '';
                    if (ratio < t) {
                        rgb = fade(ratio);
                    } else if (ratio > t && ratio < t * 2) {
                        rgb = fadeOut(ratio - t);
                    } else {
                        rgb = fade(ratio - t * 2);
                    }
                    return {
                        fill: rgb
                    };
                },
                {
                    duration: 3000,
                    easing: 'easeLinear'
                    // repeat: true, // repeat
                }
            ); // no delay
        }
    },
    'rect'
);
const query = {
    'screen-xs': {
        maxWidth: 575
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199
    },
    'screen-xl': {
        minWidth: 1200
    }
};

let isMobile;
enquireScreen(b => {
    isMobile = b;
});

export function getPageTitle(props) {
    console.log(props, 'props');
    const intl = useIntl();
    const {
        route: { routes },
        location,
        currentUser
    } = props;
    const { pathname } = location;
    const appName = intl.formatMessage({ id: 'App.appName' });
    let title = appName;
    let before = '';
    switch (window.appMeta.env) {
        case 'test':
            before = intl.formatMessage({ id: 'App.envTestMark' }) + ' ';
            break;
        case 'uat':
            before = intl.formatMessage({ id: 'App.envUATMark' }) + ' ';
            break;
    }
    const getTitle = () => {
        if (currentUser && currentUser.routeMap) {
            const menu = currentUser.routeMap[pathname];
            if (menu && menu.title) {
                return menu.title;
            }
        }
        if (routes) {
            const findRoute = () => {
                let route = null;
                _find(routes);
                return route;
                function _find(data = []) {
                    for (let i = 0; i < data.length; i++) {
                        const path = data[i].path;
                        if (path && pathToRegexp(path).test(pathname)) {
                            route = data[i];
                            break;
                        }
                        _find(data[i].routes);
                    }
                }
            };
            const router = findRoute();
            if (router && router.title) return intl.formatMessage({ id: router.title });
        }
    };
    const t = getTitle();
    document.pageTitle = t;
    if (t) title = `${t} - ${appName}`;
    return before + title;
}

const BasicLayout = props => {
    const { location, currentUser, collapsed, navTheme, fixSiderbar, siderWidth, fixedHeader, siderWidthFold, layout, headerTheme, waterMarker, theme } = props;
    const { pathname } = location;
    const [state, setState] = useState({ isMobile, currentSys: '', redirectData: [] });

    useEffect(() => {
        // document.body.classList = 'dark';
        let html = document.querySelector('html');
        html.setAttribute('data-theme', theme);
        enquireScreen(mobile => {
            setState({
                ...state,
                isMobile: mobile
            });
        });
        return () => {
            html.setAttribute('data-theme', '');
        };
    }, []);
    useEffect(() => {
        if (pathname) {
            updateCurrentSys();
        }
    }, [pathname]);

    /**
     * 根据菜单取配置获得第一个有效的路由配置并进入.
     */
    function autoRedirectToFirstRoute(sysPath) {
        if (!currentUser) return null;
        const { menus, routeMap } = currentUser;
        if (!menus) return null;
        const paths = pathname.split('/').filter(item => !!item);
        if (menus.length > 0) {
            if (paths.length === 0) {
                const firstSys = findFirstChild(menus);
                if (firstSys) {
                    history.replace(firstSys.route);
                }
            } else if (paths.length === 1) {
                const menus = routeMap[sysPath];
                const firstRoute = findFirstChild(menus.children);
                if (firstRoute) history.replace(firstRoute.route);
            }
        }
        function findFirstChild(list) {
            if (!list) return null;
            for (let i = 0; i < list.length; i++) {
                const menu = list[i];
                if (menu.isMenu && !isUrl(menu.route) && menu.target !== '_blank') {
                    return menu;
                }
                if (menu.children && menu.children.length > 0) {
                    const fm = findFirstChild(menu.children);
                    if (fm) return fm;
                }
            }
            return null;
        }
    }

    function updateCurrentSys() {
        const sysPath = urlToList(pathname)[0];
        if (state.currentSys !== sysPath) {
            setState({ ...state, currentSys: sysPath });
            autoRedirectToFirstRoute(sysPath);
        }
    }

    function getSiderMenu() {
        if (!currentUser || !currentUser.routeMap || !currentUser.menus) return [];
        return currentUser.menus;
    }
    const handleMenuCollapse = collapsed => {
        props.dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed
        });
    };
    const getLayoutStyle = () => {
        const { isMobile } = state;
        if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
            return {
                paddingLeft: collapsed ? siderWidthFold : siderWidth
            };
        }
        return null;
    };
    const getContentStyle = () => {
        return {
            // margin: '24px 24px 0',
            paddingTop: fixedHeader ? 64 : 0
        };
    };
    const layoutContent = (
        <Layout>
            <SiderMenu menuData={getSiderMenu()} collapsed={collapsed} location={location} isMobile={state.isMobile} onCollapse={handleMenuCollapse} theme={navTheme} {...props} />
            <Layout
                style={{
                    ...getLayoutStyle(),
                    // background: '#f5f5f5',
                    minHeight: '100vh'
                }}
            >
                <Header handleMenuCollapse={handleMenuCollapse} isMobile={isMobile} theme={headerTheme} {...props} />
                <Content style={getContentStyle()}>
                    <Outlet />
                </Content>
                <Footer
                    style={{
                        // background: '#f5f5f5',
                        padding: 0
                    }}
                >
                    <GlobalFooter />
                </Footer>
            </Layout>
        </Layout>
    );

    return (
        <>
            <Helmet>
                <title>{getPageTitle(props)}</title>
            </Helmet>
            <ContainerQuery query={query}>
                {params => (
                    <div className={classNames(params)}>
                        {layoutContent}
                    </div>
                )}
            </ContainerQuery>
        </>
    );
};
export default connect(({ user, global, setting }) => ({
    currentUser: user.currentUser,
    collapsed: global.collapsed,
    ...setting
}))(BasicLayout);
