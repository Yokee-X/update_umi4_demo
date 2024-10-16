import { ConfigProvider } from 'antd';
import defaultSettings from './defaultSettings';
let setting = localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')) : defaultSettings;

ConfigProvider.config({
    theme: {
        primaryColor: setting.customTheme['primary-color']
    }
});
export const dva = {
    config: {
        onError(err) {}
    }
};
