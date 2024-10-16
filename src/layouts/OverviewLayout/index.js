import styles from './style.less';
import { getTheme, registerShape, registerTheme, G2 } from 'bizcharts';
const defaultChartTheme = getTheme('default');
import forOwn from 'lodash/forOwn';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { getPageTitle } from '../BasicLayout';
import { Helmet } from 'umi';
const { Canvas } = G2.getEngine('canvas');

// 后续操作一样
// 原始的计算坐标方法
const rawGetPointByClient = Canvas.prototype.getPointByClient;
// 由于需要运行时this指针，这个函数不可改为箭头函数。
Canvas.prototype.getPointByClient = function (clientX, clientY) {
    // 获取原函数返回的坐标值
    const raw = rawGetPointByClient.call(this, clientX, clientY);
    // 获取设定高宽和真实高宽。
    // 当设定的高宽不等于getBoundingClientRect获取的高宽时，说明存在缩放。
    const el = this.get('el');
    const bbox = el.getBoundingClientRect();
    const setWidth = this.get('width');
    const setHeight = this.get('height');
    const { width: realWidth, height: realHeight } = bbox;
    // 除以缩放比（真实高宽 / 设定高宽）获得真实的坐标。
    return {
        x: raw.x / (realWidth / setWidth),
        y: raw.y / (realHeight / setHeight)
    };
};
registerShape('interval', 'border-radius', {
    draw(cfg, container) {
        const { points } = cfg;
        let path = [];
        path.push(['M', points[0].x, points[0].y]);
        path.push(['L', points[1].x, points[1].y]);
        path.push(['L', points[2].x, points[2].y]);
        path.push(['L', points[3].x, points[3].y]);
        path.push('Z');
        path = this.parsePath(path); // 将 0 - 1 转化为画布坐标

        const group = container.addGroup();
        group.addShape('rect', {
            attrs: {
                x: path[1][1], // 矩形起始点为左上角
                y: path[1][2],
                width: path[2][1] - path[1][1],
                height: path[0][2] - path[1][2] < 1 ? 1 : path[0][2] - path[1][2],
                fill: cfg.color,
                // radius: (path[2][1] - path[1][1]) / 2,
                radius: path[0][2] - path[1][2] < 12 ? 0 : (path[2][1] - path[1][1]) / 2
            }
        });

        return group;
    }
});

registerShape('interval', 'border-radius-vertical', {
    draw(cfg, container) {
        const { points } = cfg;
        let path = [];
        path.push(['M', points[0].x, points[0].y]);
        path.push(['L', points[1].x, points[1].y]);
        path.push(['L', points[2].x, points[2].y]);
        path.push(['L', points[3].x, points[3].y]);
        path.push('Z');
        path = this.parsePath(path); // 将 0 - 1 转化为画布坐标

        const group = container.addGroup();
        group.addShape('rect', {
            attrs: {
                x: path[3][1], // 矩形起始点为左上角
                y: path[3][2],
                width: path[2][1] - path[3][1] < 1 ? 1 : path[2][1] - path[3][1],
                height: path[0][2] - path[3][2],
                fill: cfg.color,
                // radius: (path[0][2] - path[3][2]) / 2,
                radius: path[2][1] - path[3][1] < 12 ? 0 : (path[0][2] - path[3][2]) / 2
            }
        });

        return group;
    }
});

const OverviewLayout = props => {
    const { children } = props;
    const [scale, setScale] = useState(1);
    useEffect(() => {
        // document.body.style.zoom = 1 / window.devicePixelRatio;
        // document.body.style.transform = `scale(${window.innerHeight / 1080}) `;
        document.body.className = 'dark-theme';
        document.body.style.overflow = 'hidden';
        setScale(window.innerHeight / 1080);
        window.addEventListener('resize', () => {
            setScale(window.innerHeight / 1080);
        });
        const darkTheme = getTheme('dark');
        const traverse = obj => {
            forOwn(obj, (value, key, parent) => {
                if (typeof value === 'object') {
                    traverse(value);
                } else if (parent && key === 'fontSize') {
                    parent[key] = 13;
                }
                // else if (parent && key === 'fill') {
                //     parent[key] = '#fff';
                // }
            });
        };
        traverse(darkTheme);
        registerTheme('default', {
            ...darkTheme,
            background: 'transparent'
        });
        return () => {
            document.body.className = '';
            registerTheme('default', defaultChartTheme);
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>{getPageTitle(props)}</title>
            </Helmet>
            <div className={styles.container} style={{ transform: `scale(${scale}) translate(-50%,0)` }}>
                {children}
            </div>
        </>
    );
};

export default connect(({ user }) => ({
    currentUser: user.currentUser
}))(OverviewLayout);
