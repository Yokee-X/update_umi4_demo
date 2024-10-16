import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import BaseMenu, { getMenuMatches } from './BaseMenu';
import { urlToList } from '@/utils';

const { Sider } = Layout;

/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
const getDefaultCollapsedSubMenus = props => {
    // const {
    //     menuData
    // } = props;
    // return menuData.map(item=>item.route)

    const {
        flatMenuKeys,
        location: { pathname }
    } = props;
    return urlToList(pathname)
        .map(item => getMenuMatches(flatMenuKeys, item)[0])
        .filter(item => item);
};

const SiderMenu = props => {
    const { collapsed, onCollapse, fixSiderbar, siderWidth, theme, menuData } = props;
    const [openKeys, setOpenKeys] = useState(getDefaultCollapsedSubMenus(props));
    useEffect(() => {
        setOpenKeys(getDefaultCollapsedSubMenus(props));
    }, [props.location.pathname]);

    const isMainMenu = key => {
        return menuData.some(item => {
            if (key) {
                return item.key === key || item.path === key;
            }
            return false;
        });
    };

    const handleOpenChange = openKeys => {
        const moreThanOne = openKeys.filter(openKey => isMainMenu(openKey)).length > 1;
        setOpenKeys(moreThanOne ? [openKeys.pop()] : [...openKeys]);
    };

    const defaultProps = collapsed ? {} : { openKeys };
    const siderClassName = classNames(styles.sider, {
        [styles.fixSiderbar]: fixSiderbar,
        [styles.light]: theme === 'light'
    });

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            breakpoint="lg"
            onCollapse={onCollapse}
            width={siderWidth}
            theme={theme}
            className={siderClassName}
        >
            <BaseMenu {...props} mode="inline" onOpenChange={handleOpenChange} {...defaultProps} />
        </Sider>
    );
};
export default SiderMenu;
