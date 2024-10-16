import request from '../utils/request';

// 升级任务列表
export async function getUpgradeList(params) {
    return request.get('upStrategy/list', { params });
}
//新增任务
export async function insertUpgrade(data) {
    return request.post('upStrategy/insert', data);
}
//编辑任务
export async function updateUpgrade(data) {
    return request.post('upStrategy/update', data);
}
//删除任务
export async function deleteUpgrade(params) {
    return request.delete('upStrategy/delete', { params });
}
//发布任务
export async function publishUpgrade(params) {
    return request.post('upStrategy/publish', {}, { params });
}
//修改任务状态
export async function changeUpgradeStatus(params) {
    return request.post('upStrategy/status', {}, { params });
}
//任务详情
export async function getUpgradeDetail(params) {
    return request.get('upStrategy/detail', { params });
}
//查询规则名称
export async function getRuleName(params) {
    return request.post('upStrategy/getVernumAndVername', params);
}
//新增、编辑升级范围
export async function upsertUpgradeRange(params) {
    const { id, ...rest } = params;
    return id ? request.post('upStrategyRange/update', rest, { params: { id } }) : request.post('upStrategyRange/insert', params);
}
//获取升级范围列表
export async function getUpgradeRange(params) {
    return request.get('upStrategyRange/list', { params });
}
//删除升级范围
export async function delUpgradeRange(params) {
    return request.delete('upStrategyRange/delete', { params });
}
//获取范围车辆数
export async function getRangeMatchesNum(data) {
    return request.post('upStrategyRange/queryRangeMatchesNum', data).then(res => res.data);
}
//根据id获取范围车辆数
export async function getRangeMatchesNumById(params) {
    return request.get('upStrategyRange/queryRangeMatchesNumByRangeId', { params }).then(res => res.data);
}
//获取vin加密
export async function getRangeVin(data) {
    return request.post('upStrategy/verifyValidVin', data).then(res => res.data);
}
