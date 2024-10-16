import { FormattedMessage, connect, history } from 'umi';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Avatar, message } from 'antd';
import styles from './index.less';
import { getPublicPath, randomColor } from '@/utils';
import GlobalSetting from '../GlobalSetting';

const GlobalHeaderRight = props => {
    const { currentUser, theme, isMobile } = props;
    const handleUserMenuClick = ({ key }) => {
        switch (key) {
            case 'logout':
                props
                    .dispatch({
                        type: 'user/logout'
                    })
                    .then(v => message.success('退出登陆'))
                    .catch(e => message.error(e.message));
                break;
            case 'modifyPassword':
                history.push('/user/changePassword');
                break;
        }
    };

    let className = styles.right;
    if (theme === 'dark') {
        className = `${styles.right}  ${styles.dark}`;
    }
    if (!currentUser) return null;
    const items = [
        {
            label: <FormattedMessage id={'Component.globalHeader.menu.changePassword'} />,
            key: 'modifyPassword',
            icon: <SettingOutlined />
        },
        {
            label: <FormattedMessage id={'Component.globalHeader.menu.logout'} />,
            key: 'logout',
            icon: <LogoutOutlined />
        }
        // <Menu theme={theme} className={styles.menu} selectedKeys={[]} onClick={handleUserMenuClick}>
        //     <Menu.Item key="modifyPassword">
        //         <SettingOutlined /> <FormattedMessage id={'Component.globalHeader.menu.changePassword'} />
        //     </Menu.Item>
        //     <Menu.Item key="logout">
        //         <LogoutOutlined /> <FormattedMessage id={'Component.globalHeader.menu.logout'} />
        //     </Menu.Item>
        // </Menu>
    ];
    return (
        <div className={className}>
            <Dropdown menu={{ items, onClick: handleUserMenuClick }} placement="bottomRight">
                <div className={`${styles.action} ${styles.account}`}>
                    <Avatar style={{ backgroundColor: currentUser.avatar.bgColor }} className={styles.avatar}>
                        {currentUser.avatar.content}
                    </Avatar>
                    {/* <img className={styles.avatar} src={getPublicPath('img/avatar.png')} /> */}
                    <span className={styles.name}>{currentUser.name || currentUser.loginName}</span>
                </div>
            </Dropdown>
            <GlobalSetting />
        </div>
    );
};
export default connect()(GlobalHeaderRight);
