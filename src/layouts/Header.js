import React, { PureComponent, useEffect, useState } from 'react';
import { Layout } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import GlobalHeader from '@/components/GlobalHeader';
import styles from './Header.less';
const { Header } = Layout;

const HeaderView = props => {
    const { handleMenuCollapse, setting, style, isMobile, collapsed, siderWidth, siderWidthFold } = props;

    const getHeadWidth = () => {
        const { fixedHeader } = setting;
        if (isMobile || !fixedHeader) {
            return '100%';
        }
        return collapsed ? `calc(100% - ${siderWidthFold}px)` : `calc(100% - ${siderWidth}px)`;
    };

    const { fixedHeader } = setting;
    const width = getHeadWidth();

    return (
        <Animate component="" transitionName="fade">
            <Header style={{ padding: 0, width, ...style }} className={fixedHeader ? styles.fixedHeader : ''}>
                <GlobalHeader onCollapse={handleMenuCollapse} {...props} />
            </Header>
        </Animate>
    );
};
export default connect(({ user, global, setting }) => ({
    currentUser: user.currentUser,
    collapsed: global.collapsed,
    setting
}))(HeaderView);
