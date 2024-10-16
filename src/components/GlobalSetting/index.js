import { SettingOutlined } from '@ant-design/icons';
import DrawerConfirm from '../DrawerConfirm';
import { useState } from 'react';
import { ConfigProvider, Form, Space, Switch } from 'antd';
import { DRAWER_CONFIRM_WIDTH } from '@/constants/global';
import { connect } from 'umi';
import { DarkIcon, LightIcon } from '../CustomIcon';

const GlobalSetting = props => {
    const { setting } = props;
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState(setting.customTheme);
    const close = () => {
        setVisible(false);
    };
    const changeTheme = e => {
        let theme = e ? 'dark' : 'light';
        let html = document.querySelector('html');
        html.setAttribute('data-theme', theme);

        // document.body.className = theme;
        props.dispatch({ type: 'setting/settingChange', payload: { theme } });
    };
    const isLight = setting.theme == 'light';
    return (
        <>
            <SettingOutlined onClick={() => setVisible(true)} />
            <DrawerConfirm title={'界面配置'} open={visible} width={300} onCancel={close} footer={false}>
                <Form>
                    <Form.Item label={'主题颜色'}>
                        <input
                            type={'color'}
                            value={color['primary-color']}
                            onChange={e => {
                                setColor({ ...color, 'primary-color': e.target.value });
                                ConfigProvider.config({
                                    theme: {
                                        primaryColor: e.target.value
                                        // errorColor: e.target.value,
                                        // warningColor: e.target.value,
                                        // successColor: e.target.value,
                                        // infoColor:e.target.value,
                                    }
                                });
                            }}
                            onBlur={() => {
                                props.dispatch({ type: 'setting/settingChange', payload: { customTheme: color } });
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={'主题设置'}>
                        <Space>
                            <LightIcon style={isLight ? { color } : {}} />
                            <Switch checked={!isLight} onChange={changeTheme} />
                            <DarkIcon style={!isLight ? { color } : {}} />
                        </Space>
                    </Form.Item>
                    <Form.Item label={'开启水印'}>
                        <Switch checked={setting.waterMarker} onChange={e => props.dispatch({ type: 'setting/settingChange', payload: { waterMarker: e } })} />
                    </Form.Item>
                </Form>
            </DrawerConfirm>
        </>
    );
};

export default connect(({ setting }) => ({ setting }))(GlobalSetting);
