import { useEffect } from 'react';
import { Col, ConfigProvider, Row, Switch } from 'antd';
import { Link, useIntl } from 'umi';
import styles from './index.less';
import RightContent from './RightContent';
import { getPublicPath } from '@/utils';
import _ from 'lodash';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const GlobalHeader = props => {
    const { collapsed, collapsable = true, isMobile, currentUser, onSysMenuClick, theme, onCollapse } = props;
    const intl = useIntl();
    useEffect(() => {
        return () => {
            triggerResizeEvent.cancel();
        };
    }, []);

    const triggerResizeEvent = _.debounce(() => {
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
    }, 600);

    const toggle = () => {
        onCollapse(!collapsed);
        triggerResizeEvent();
    };

    return (
        <div className={`${styles.header} ${styles[theme]}`}>
            <Row type={'flex'} style={{ height: '100%' }} align={'middle'}>
                <Col className={styles.headerLeft}>
                    {isMobile && (
                        <Link to="/" className={styles.logo} key="logo">
                            {/* <img src={logo} alt="logo" width="32" /> */}
                        </Link>
                    )}
                    {collapsable && (
                        <div className={styles.trigger} onClick={toggle}>
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </div>
                    )}
                </Col>
                <Col className={styles.headerCenter}>
                    <span className={styles.appName}>{intl.formatMessage({ id: 'App.appName' })}</span>
                </Col>

                <Col className={styles.headerRight}>
                    <RightContent {...props} />
                </Col>
            </Row>
        </div>
    );
};
export default GlobalHeader;
