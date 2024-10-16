import { Ssologin, modifyPassword, login, logout, Ssologout } from '@/services/user';
import { getPublicPath, md5 } from '@/utils';
import { history } from 'umi';
import pathToRegexp from 'path-to-regexp';
import Cookies from 'js-cookie';
import { message } from 'antd';
import CryptoJS from 'crypto-js';

// 用户存储cookie区域， 用户实际信息存储在localStorage内，在cookie内保存一个key来对应storage里面的内容
class UserCookieStore {
    storePrefix = '';
    userMarkPrefix = '@user_';
    Storage = localStorage;
    cookieKey = 'user-key';
    constructor(storePrefix) {
        this.storePrefix = storePrefix;
    }
    set(data) {
        this.clear();
        if (!data) return;
        const storeKey = this.getRealKey() + Date.now();
        this.Storage.setItem(storeKey, window.JSON.stringify(data));
        Cookies.set(this.cookieKey, storeKey, { path: '/' });
    }
    get() {
        const storeKey = Cookies.get(this.cookieKey);
        if (!storeKey) return null;
        let user = this.Storage.getItem(storeKey);
        if (!user) return null;
        return window.JSON.parse(user);
    }
    getRealKey() {
        return this.storePrefix + this.userMarkPrefix;
    }
    clear() {
        const regx = new RegExp('^(' + this.getRealKey() + ')');
        for (let i = 0; i < this.Storage.length; i++) {
            const key = this.Storage.key(i);
            if (regx.test(key)) {
                this.Storage.removeItem(key);
            }
        }
    }
}
const userCookieStore = new UserCookieStore('ssc');
const localUser = getUserFromStore();

export default {
    namespace: 'user',
    state: {
        currentUser: localUser
    },
    effects: {
        *login({ payload }, { call, put }) {
            payload.password = SignPassword(payload.password);
            const response = yield call(login, payload);
            const AuthUser = extUserAuthMap(response);
            yield put({
                type: 'changeStatus',
                payload: {
                    currentUser: AuthUser
                }
            });
            return AuthUser;
        },
        *SsoLogin({ payload }, { call, put }) {
            // payload.password = SignPassword(payload.password);
            const response = yield call(Ssologin, payload);
            const AuthUser = extUserAuthMap(response);
            yield put({
                type: 'changeStatus',
                payload: {
                    currentUser: AuthUser
                }
            });
            return AuthUser;
        },
        *logout({ payload }, { put, call, select }) {
            let query = {};
            if (payload && payload.takeRouteInfo) {
                query.r = window.location.href;
            }
            const id = yield select(state => state.user.currentUser?.id);
            if (id) yield call(logout, { id });
            history.push({
                pathname: '/',
                query
            });
            yield put({
                type: 'changeStatus',
                payload: {
                    currentUser: null
                }
            });
            console.log(id, 'idddddddddddddddddd');
        },
        *SsoLogout({ payload }, { put, call, select }) {
            let query = {};
            if (payload && payload.takeRouteInfo) {
                query.r = window.location.href;
            }
            const id = yield select(state => state.user.currentUser?.id);
            const token = sessionStorage.getItem('SSO') || '';
            if (id) {
                try {
                    sessionStorage.removeItem('SSO');
                    history.push({
                        pathname: '/',
                        query
                    });
                    yield put({
                        type: 'changeStatus',
                        payload: {
                            currentUser: null
                        }
                    });
                    yield call(Ssologout, { authorization: token });
                } catch (err) {
                    message.error(err.message);
                }
            } else {
                history.push({
                    pathname: '/',
                    query
                });
                yield put({
                    type: 'changeStatus',
                    payload: {
                        currentUser: null
                    }
                });
            }
        },
        *modifyPassword({ payload }, { call, select }) {
            const params = payload.params;
            params.id = yield select(state => state.user.currentUser.id);
            params.oldPwd = SignPassword(params.password);
            params.newPwd = SignPassword(params.new_password);
            params.password = undefined;
            params.new_password = undefined;
            params.re_new_password = undefined;
            yield call(modifyPassword, params);
        }
    },

    reducers: {
        changeStatus(state, { payload }) {
            if ('currentUser' in payload) storeUser(payload.currentUser);
            return {
                ...state,
                ...payload
            };
        }
    }
};

export const SignPassword = password => {
    const secretKey = CryptoJS.enc.Hex.parse('8f46885d6cf938ff257e3911ab409d25');
    const m = CryptoJS.enc.Utf8.parse(CryptoJS.SHA256(password).toString());
    const res = CryptoJS.AES.encrypt(m, secretKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
    return res;
};

function storeUser(user) {
    if (user) {
        user = { ...user };
        delete user.routeMap;
        delete user.dnaMap;
        userCookieStore.set(user);
    } else {
        userCookieStore.clear();
    }
}

function getUserFromStore() {
    const user = userCookieStore.get();
    if (!user) return null;
    return extUserAuthMap(user);
}

function extUserAuthMap(user) {
    const routeMap = {},
        dnaMap = {};
    const menus = user.menus || [];
    walkMenu(menus);

    function walkMenu(menus) {
        menus.map(menu => {
            routeMap[menu.route] = menu;
            dnaMap[menu.dna] = menu;
            menu.pathRegexp = pathToRegexp(menu.route);
            if (menu.children) {
                walkMenu(menu.children);
            }
        });
    }
    user.routeMap = routeMap;
    user.dnaMap = dnaMap;
    user.avatar = createAvatar(user.name || '');
    return user;
}

// 根据字符串生成头像
export function createAvatar(name) {
    let avatar = {
        src: getPublicPath('/img/avatar.png'),
        name
    };
    let nameChar = '';
    if (/.*[\u4e00-\u9fa5]+.*$/.test(name)) {
        //如果是中文名字，取后面最多两位
        nameChar = name.substr(name.length > 2 ? name.length - 2 : name.length - 1);
    } else {
        // 英文名字取前面2位
        nameChar = name.substr(0, 2);
    }
    if (nameChar) {
        avatar = {
            content: nameChar,
            bgColor: getColorByName(name),
            name
        };
    }
    return avatar;
    function getColorByName(name) {
        if (!name) return '#cccccc';
        let str = '';
        for (let i = 0; i < name.length; i++) {
            str += parseInt(name[i].charCodeAt(0), 10).toString(16);
        }
        const color = str.slice(1, 4);
        if (color.length < 3) return '#c5c5c5';
        return '#' + color;
    }
}
