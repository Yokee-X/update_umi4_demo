import defaultSettings from '../defaultSettings';
let setting = localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')) : defaultSettings;
export default {
    namespace: 'setting',
    state: setting,
    reducers: {
        settingChange(state, { payload }) {
            let newTheme = {
                ...state,
                ...payload
            };
            localStorage.setItem('theme', JSON.stringify(newTheme));
            return newTheme;
        }
    }
};
