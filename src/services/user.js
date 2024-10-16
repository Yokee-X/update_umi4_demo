import request from '../utils/request';
import { PermissionsUtil, joinPath, isUrl } from '../utils';
import { getPublicPath } from '@/utils';
import { getLocale } from 'umi';
export async function login(params) {
    return request.post('login', params).then(decorateUserInfo);
}
export async function Ssologin(params) {
    return request.get('loginBySsoToken', { params }).then(decorateUserInfo);
}

export async function logout(params) {
    return request.post('signOut', params);
}

export async function Ssologout(params) {
    return request.get('logoutSso', { params });
}

export async function modifyPassword(params) {
    return request.post('modifyPwd', params);
}

function decorateUserInfo(data) {
    const userInfo = {
        ...data.user,
        token: data.token
    };
    userInfo.avatar = getPublicPath('/img/avatar.png');
    const menus = PermissionsUtil.structureByDNA(data.menus);
    _initMenus(menus);
    userInfo.menus = menus;
    return userInfo;
}

function _initMenus(menus, parent) {
    for (let i = 0; i < menus.length; i++) {
        let menu = menus[i];
        // if(menu.status === 2)continue;
        extendAttributes(menu);
        if (menu.children) {
            _initMenus(menu.children, menu);
        }
    }

    function extendAttributes(menu) {
        menu.isDir = menu.type == 2;
        menu.isMenu = menu.type == 0;
        menu.isAction = menu.type == 1;
        if (/^-/.test(menu.href)) {
            menu.href = menu.href.replace(/^-/, '');
            menu.target = '_blank';
        }
        if (isUrl(menu.href)) {
            menu.route = menu.href;
            if (!menu.target) {
                menu.target = '_blank';
            }
        } else {
            menu.route = parent ? joinPath('/', parent.route, menu.href) : joinPath('/', menu.href);
        }
        if (menu.remarks) {
            menu.title = JSON.parse(menu.remarks)[getLocale()];
        }
        menu.id = menu.id || Date.now();
    }
}
