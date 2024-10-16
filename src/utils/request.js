import axios from 'axios';
import { joinPath } from '@/utils/index';
import config from 'config';
import { message } from 'antd';
import { getDvaApp } from 'umi';

const baseURL = config.api;
const locale = localStorage.getItem('umi_locale') || 'zh-CN';
const instance = axios.create({
    baseURL,
    timeout: 3000 * 60 * 10
});

async function createDefaultRequest() {
    const intl = (await import('@/locales')).default;

    instance.interceptors.request.use(config => {
        const state = getDvaApp()._store.getState();
        if (state.user?.currentUser?.token) {
            config.headers['token'] = state.user.currentUser.token;
        }
        config.headers['Accept-Language'] = locale;
        if (config.params) {
            for (let k in config.params) {
                if (config.params[k] && typeof config.params[k] == 'string') {
                    if (config.params[k].match(/[\[\]]/)) {
                        config.params[k] = encodeURIComponent(config.params[k]);
                    }
                }
            }
        }
        return config;
    });
    instance.interceptors.response.use(
        response => {
            const data = response.data;
            if (data instanceof Blob) {
                if (response.headers['content-type'].includes('application/json')) {
                    return response.data.text().then(s => {
                        let json = JSON.parse(s);
                        if (json.code == 120611) {
                            window.g_app._store.dispatch({
                                type: 'user/logout',
                                payload: {
                                    takeRouteInfo: true
                                }
                            });
                        }
                        return message.error(json.message || intl.formatMessage({ id: 'Common.msg.noknowError' }));
                    });
                }
                const disp = response.headers['content-disposition'] || '';
                const dispMap = {};
                disp.split(';').forEach(item => {
                    const kv = item.split('=');
                    dispMap[kv[0]] = kv[1] || kv[0];
                });
                data.filename = dispMap.filename;
                return data;
            }
            if (data.success === true) {
                return new Promise(rs => {
                    setTimeout(() => {
                        rs(response.data);
                    }, 1000);
                });
            }
            if (data.code == 120611) {
                getDvaApp()._store.dispatch({
                    type: 'user/logout',
                    payload: {
                        takeRouteInfo: true
                    }
                });
                return message.error(data.message || intl.formatMessage({ id: 'Common.msg.noknowError' }));
            }
            if (data.isExpired) {
                return message.error(data.message || intl.formatMessage({ id: 'Common.msg.noknowError' }), 0.8).then(() => {
                    location.reload();
                    return Promise.reject();
                });
            }
            return Promise.reject({
                ...data,
                message: data.message || intl.formatMessage({ id: 'Common.msg.noknowError' }),
                code: data.code,
                response,
                data,
                type: 'RequestError'
            });
        },
        r => {
            let resultError = { response: r };
            if (r.response) {
                const response = r.response;
                if (typeof response.data === 'object') {
                    resultError = {
                        response,
                        code: response.data.errorCode,
                        message: response.data.errorMsg || response.data.message || intl.formatMessage({ id: 'Common.msg.noknowError' }),
                        requestId: response.data.requestId
                    };
                    if (response.data.status === 401) {
                        getDvaApp()._store.dispatch({
                            type: 'user/logout',
                            payload: {
                                takeRouteInfo: true
                            }
                        });
                    }
                } else {
                    const status = response.status;
                    console.log(status);
                    if (status === 401) {
                        getDvaApp()._store.dispatch({
                            type: 'user/logout',
                            payload: {
                                takeRouteInfo: true
                            }
                        });
                    }
                    resultError = {
                        message: `[${status}]${response.statusText}`,
                        code: status
                    };
                }
                resultError.response = response;
            } else {
                resultError.message = intl.formatMessage({ id: 'App.networkError' });
            }
            resultError.type = 'RequestError';
            return Promise.reject(resultError);
        }
    );
    instance.getAbsUrl = function (url) {
        return joinPath(baseURL, url);
    };
    return instance;
}

createDefaultRequest();
export default instance;
