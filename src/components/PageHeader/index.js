import React, { PureComponent, createElement } from 'react';
import pathToRegexp from 'path-to-regexp';
import { LeftCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Tabs, Skeleton } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import { urlToList } from '@/utils';
import { history } from 'umi';

const { TabPane } = Tabs;
export const getBreadcrumb = (breadcrumbNameMap, url) => {
    let breadcrumb = breadcrumbNameMap[url];
    if (!breadcrumb) {
        Object.keys(breadcrumbNameMap).forEach(item => {
            if (pathToRegexp(item).test(url)) {
                breadcrumb = breadcrumbNameMap[item];
            }
        });
    }
    return breadcrumb || {};
};

export default class PageHeader extends PureComponent {
    state = {
        breadcrumb: null
    };

    componentDidMount() {
        this.getBreadcrumbDom();
    }

    componentDidUpdate(preProps) {
        const { location } = this.props;
        if (!location || !preProps.location) {
            return;
        }
        const prePathname = preProps.location.pathname;
        if (prePathname !== location.pathname) {
            this.getBreadcrumbDom();
        }
    }

    onChange = key => {
        const { onTabChange } = this.props;
        if (onTabChange) {
            onTabChange(key);
        }
    };

    getBreadcrumbProps = () => {
        const { routes, params, location, breadcrumbNameMap } = this.props;
        return {
            routes,
            params,
            routerLocation: location,
            breadcrumbNameMap
        };
    };

    getBreadcrumbDom = () => {
        const breadcrumb = this.conversionBreadcrumbList();
        this.setState({
            breadcrumb
        });
    };

    // Generated according to props
    conversionFromProps = () => {
        const { breadcrumbList, breadcrumbSeparator, itemRender, linkElement = 'a' } = this.props;
        return (
            <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
                {breadcrumbList.map(item => {
                    const title = itemRender ? itemRender(item) : item.title;
                    return (
                        <Breadcrumb.Item key={item.title}>
                            {item.href
                                ? createElement(
                                      linkElement,
                                      {
                                          [linkElement === 'a' ? 'href' : 'to']: item.href
                                      },
                                      title
                                  )
                                : title}
                        </Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
        );
    };

    conversionFromLocation = (routerLocation, breadcrumbNameMap) => {
        const { breadcrumbSeparator, home, itemRender, linkElement = 'a' } = this.props;
        // Convert the url to an array
        const pathSnippets = urlToList(routerLocation.pathname);
        // Loop data mosaic routing
        const extraBreadcrumbItems = pathSnippets.map((url, index) => {
            const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
            if (currentBreadcrumb.inherited) {
                return null;
            }
            const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
            const name = itemRender ? itemRender(currentBreadcrumb) : currentBreadcrumb.name;
            return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? <Breadcrumb.Item key={url}>{createElement(isLinkable ? linkElement : 'span', { [linkElement === 'a' ? 'href' : 'to']: url }, name)}</Breadcrumb.Item> : null;
        });
        // Add home breadcrumbs to your head
        extraBreadcrumbItems.unshift(
            <Breadcrumb.Item key="home">
                {createElement(
                    linkElement,
                    {
                        [linkElement === 'a' ? 'href' : 'to']: '/'
                    },
                    home || 'Home'
                )}
            </Breadcrumb.Item>
        );
        return (
            <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
                {extraBreadcrumbItems}
            </Breadcrumb>
        );
    };

    /**
     * 将参数转化为面包屑
     * Convert parameters into breadcrumbs
     */
    conversionBreadcrumbList = () => {
        const { breadcrumbList, breadcrumbSeparator } = this.props;
        const { routes, params, routerLocation, breadcrumbNameMap } = this.getBreadcrumbProps();
        if (breadcrumbList && breadcrumbList.length) {
            return this.conversionFromProps();
        }
        // 如果传入 routes 和 params 属性
        // If pass routes and params attributes
        if (routes && params) {
            return <Breadcrumb className={styles.breadcrumb} routes={routes.filter(route => route.breadcrumbName)} params={params} itemRender={this.itemRender} separator={breadcrumbSeparator} />;
        }
        // 根据 location 生成 面包屑
        // Generate breadcrumbs based on location
        if (routerLocation && routerLocation.pathname) {
            return this.conversionFromLocation(routerLocation, breadcrumbNameMap);
        }
        return null;
    };

    // 渲染Breadcrumb 子节点
    // Render the Breadcrumb child node
    itemRender = (route, params, routes, paths) => {
        const { linkElement = 'a' } = this.props;
        const last = routes.indexOf(route) === routes.length - 1;
        return last || !route.component ? (
            <span>{route.breadcrumbName}</span>
        ) : (
            createElement(
                linkElement,
                {
                    href: paths.join('/') || '/',
                    to: paths.join('/') || '/'
                },
                route.breadcrumbName
            )
        );
    };

    render() {
        const { title, logo, action, content, extraContent, tabList, className, tabActiveKey, tabDefaultActiveKey, tabBarExtraContent, loading = false, wide = false, showBack = true, backCallback } = this.props;
        const { breadcrumb } = this.state;

        const clsString = classNames(styles.pageHeader, className);
        const activeKeyProps = {};
        if (tabDefaultActiveKey !== undefined) {
            activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
        }
        if (tabActiveKey !== undefined) {
            activeKeyProps.activeKey = tabActiveKey;
        }
        return (
            <div className={clsString}>
                <div className={wide ? styles.wide : ''}>
                    <Skeleton loading={loading} title={false} active paragraph={{ rows: 3 }} avatar={{ size: 'large', shape: 'circle' }}>
                        {breadcrumb}

                        <div className={styles.detail}>
                            <div className={styles.titleContent}>
                                {logo && <div className={styles.logo}>{logo}</div>}
                                {title && <h1 className={styles.title}>{title}</h1>}
                                {showBack && (
                                    <a
                                        className={styles.backIcon}
                                        onClick={() => {
                                            backCallback?.();
                                            history.goBack();
                                        }}
                                    >
                                        返回上一级
                                    </a>
                                )}
                            </div>
                            {(content || extraContent) && (
                                <div className={styles.row}>
                                    {content && <div className={styles.content}>{content}</div>}
                                    {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
                                </div>
                            )}
                        </div>
                        {tabList && tabList.length ? (
                            <Tabs className={styles.tabs} {...activeKeyProps} onChange={this.onChange} tabBarExtraContent={tabBarExtraContent}>
                                {tabList.map(item => (
                                    <TabPane tab={item.tab} key={item.key} />
                                ))}
                            </Tabs>
                        ) : null}
                    </Skeleton>
                </div>
            </div>
        );
    }
}
