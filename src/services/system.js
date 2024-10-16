import request from '../utils/request';
import { PermissionsUtil } from '../utils';

function decoratePermission(list = []) {
    const existsPermissionsID = [];
    list.forEach(item => {
        existsPermissionsID.push(item.id);
    });
    const tree = PermissionsUtil.structureByDNA(list);
    return { tree, existsPermissionsID, list };
}
export async function getPermissions(params) {
    return request.get('menus', { params }).then(res => decoratePermission(res.menus));
}
export async function savePermissions(data) {
    return request.post('menus', data);
}
export async function getRoles(params) {
    return request.get('roles', { params });
}
export async function getRoleDetail(id) {
    return request.get(`role/${id}`);
}
export async function updateRole(params) {
    const { id, ...rest } = params;
    return request.post(`role/${id}`, rest);
}
export async function addRole(role) {
    return request.post('role', role);
}
export async function getUsers(params) {
    return request.get('users', { params });
}
export async function deleteRole(id) {
    return request.delete(`role/${id}`);
}
export async function createUser(user) {
    return request.post('user', user);
}
export async function updateUser(params) {
    const { id, ...rest } = params;
    return request.post(`user/${id}`, rest);
}
export async function upsertUser(user) {
    return user.id ? updateUser(user) : createUser(user);
}
export async function deleteUser(id) {
    return request.delete(`user/${id}`);
}
export async function unblockUser(id) {
    return request.post(`user/unblock`, {}, { params: { id } });
}
export async function getUserDetail(id) {
    return request.get(`user/${id}`);
}
// export async function getUserInfoByWorkNo(params) {
//     return request.get(`/getUserInfoByWorkNo`,{params});
// }
export async function getUserInfoByCondition(params) {
    return request.get(`/getUserInfoByCondition`, { params });
}
//新增用户免验权限
export async function addUserWithoutRole(user) {
    return request.post('addUserWithoutRole', user);
}
export async function resetUserPassword(params) {
    const { id } = params;
    return request.post(`resetPassword?id=${id}`, params);
}

// 获取字典列表
export async function getDictionaries(params) {
    return request.get('dicts', { params });
}
//获取字典类型
export async function getDictTypes() {
    return request.get('dictTypes');
}
// 新增字典
export async function addDictionary(params) {
    return request.post('dict', params);
}
// 修改字典
export async function updateDictionary(params) {
    const { id, ...rest } = params;
    return request.post(`dict/${id}`, rest);
}
// 删除字典
export async function delDictionary(id) {
    return request.delete(`dict/${id}`);
}
// 获取定时任务列表
export async function getTimedTasks(params) {
    return request.get('quartzTasks', { params });
}
// 新增定时任务
export async function addTimedTask(params) {
    return request.post('quartzTask', params);
}
// 修改定时任务
export async function updateTimedTask(params) {
    const { id, ...rest } = params;
    return request.post(`quartzTask/${id}`, rest);
}
// 删除定时任务
export async function delTimedTask(ids) {
    return request.post('quartzTask/delete', ids);
}
export async function pauseTimedTask(ids) {
    return request.post('quartzTask/pause', ids);
}
export async function resumeTimedTask(ids) {
    return request.post('quartzTask/resume', ids);
}
export async function execTimedTask(ids) {
    return request.post('quartzTask/run', ids);
}

//登陆限制配置查询
export async function getLoginLimit() {
    return request.get('getLoginLimit');
}
//修改登陆限制配置
export async function updateLoginLimit(params) {
    const { id, ...rest } = params;
    return request.post('updateLoginLimit', rest, { params: { id } });
}
