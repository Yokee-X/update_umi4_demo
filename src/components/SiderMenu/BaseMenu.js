import React, { PureComponent } from 'react';
import * as Icons from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'umi';
import pathToRegexp from 'path-to-regexp';
import { isUrl, urlToList } from '@/utils';
import styles from './index.less';

const getIcon = icon => {
    if (!icon) return null;
    if (typeof icon === 'string' && icon.indexOf('http') === 0) {
        return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`} />;
    }
    if (typeof icon === 'string') {
        // return <LegacyIcon type={icon} />;
        return Icons[icon] ? React.createElement(Icons[icon], null, false) : null;
    }
    return null;
};

export const getMenuMatches = (flatMenuKeys, path) => flatMenuKeys.filter(item => item && pathToRegexp(item).test(path));

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menuData
 */
export const getFlatMenuKeys = menuData => {
    let keys = [];
    if (!menuData) return keys;
    menuData.forEach(item => {
        if (item.children) {
            keys = keys.concat(getFlatMenuKeys(item.children));
        }
        keys.push(item.route);
    });
    return keys;
};

const BaseMenu = props => {
    const {
        openKeys,
        theme,
        mode,
        location: { pathname },
        isMobile,
        onCollapse,
        onOpenChange,
        style,
        menuData
    } = props;

    /**
     * 获得菜单子节点
     * @memberof SiderMenu
     */
    const getNavMenuItems = menusData => {
        if (!menusData) {
            return [];
        }
        return menusData
            .filter(item => item.isMenu || item.isDir)
            .map(item => {
                return getSubMenuOrItem(item);
            });
    };

    // Get the currently selected menu
    const getSelectedMenuKeys = () => {
        return urlToList(pathname).map(itemPath => {
            return getMenuMatches(props.flatMenuKeys, itemPath).pop();
        });
    };
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type
        };
    }
    /**
     * get SubMenu or Item
     */
    const getSubMenuOrItem = (item, isRoot) => {
        if (item.isDir) {
            const childrenItems = getNavMenuItems(item.children);
            // 当无子菜单时就不展示菜单
            if (childrenItems && childrenItems.length > 0) {
                return getItem(item.title, item.route, getIcon(item.icon), getNavMenuItems(item.children));
            }
            return null;
        } else {
            return getItem(getMenuItemPath(item), item.route, getIcon(item.icon));
        }
    };
    /**
     * 判断是否是http链接.返回 Link 或 a
     * Judge whether it is http link.return a or Link
     * @memberof SiderMenu
     */
    const getMenuItemPath = item => {
        const itemPath = conversionPath(item.route);
        const { target, title } = item;
        // Is it a http link
        if (isUrl(itemPath)) {
            return (
                <a href={itemPath} target={target}>
                    <span>{title}</span>
                </a>
            );
        }
        return (
            <Link
                to={itemPath}
                target={target}
                replace={itemPath === location.pathname}
                onClick={
                    isMobile
                        ? () => {
                              onCollapse(true);
                          }
                        : undefined
                }
            >
                <span>{title}</span>
            </Link>
        );
    };

    const conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        } else {
            return `/${path || ''}`.replace(/\/+/g, '/');
        }
    };

    // if pathname can't match, use the nearest parent's key
    let selectedKeys = getSelectedMenuKeys();
    if (!selectedKeys.length && openKeys) {
        selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let propsOther = {};
    if (openKeys) {
        propsOther = {
            openKeys
        };
    }
    return <Menu key="Menu" mode={mode} theme={theme} onOpenChange={onOpenChange} selectedKeys={selectedKeys} items={getNavMenuItems(menuData)} style={style} {...propsOther} />;
};
export default BaseMenu;
