import request from '@/utils/request';

// 获取防火墙配置列表
export async function getFirewallRules(params) {
    return request.get('firewallRules', { params });
}
// 新增防火墙配置
export async function addFirewallRule(params) {
    return request.post('firewallRule', params);
}
// 编辑防火墙配置
export async function updateFirewallRule(params) {
    const { id, ...rest } = params;
    return request.post(`firewallRule/${id}`, rest);
}
// 删除防火墙配置
export async function delFirewallRule(id) {
    return request.delete(`firewallRule/${id}`);
}
// 拷贝防火墙配置
export async function copyFirewallRule(params) {
    const { id, ...rest } = params;
    return request.post('firewallRule/copy', rest, { params: { id } });
}
// 发布防火墙配置
export async function issueFirewallRule(id) {
    return request.post(`firewallRule/${id}/publish`);
}
// 获取防火墙规则详情和策略
export async function getFirewallRulesPolicy(id) {
    return request.get(`firewallRule/${id}`);
}
// 新增防火墙策略
export async function addFirewallRulesPolicy(params) {
    const { firewallId, ...rest } = params;
    return request.post(`/firewallRule/${firewallId}/firewallPolicy`, rest);
}
// 修改防火墙策略
export async function updateFirewallRulesPolicy(params) {
    const { id, ...rest } = params;
    return request.post(`/firewallPolicy/${id}`, rest);
}
// 删除防火墙策略
export async function delFirewallRulesPolicy(id) {
    return request.delete(`/firewallPolicy/${id}`);
}

// 获取防御规则版本列表
export async function getDefRuleVers(params) {
    return request.get('defenseRuleVers', { params });
}
// 新增防御规则版本
export async function createDefRuleVer(params) {
    return request.post('defenseRuleVer', params);
}
// 拷贝新增防御规则版本
export async function copyCreateDefRuleVer(params) {
    const { id, ...rest } = params;
    return request.post(`/defenseRuleVer/${id}/copy`, rest);
}
// 修改防御规则版本
export async function updateDefRuleVer(params) {
    const { id, ...rest } = params;
    return request.post(`defenseRuleVer/${id}`, rest);
}
// 删除防御规则版本
export async function delDefRuleVer(id) {
    return request.delete(`defenseRuleVer/${id}`);
}
// 发布防御规则版本
export async function publishDefRuleVer(id) {
    return request.post(`defenseRuleVer/${id}/publish`);
}
// 导出防御规则
export function exportDefRuleVersUrl(id) {
    return request.get(`defenseRuleVer/${id}/export`, { responseType: 'blob' });
}
// 获取防御规则版本详情
export async function getDefRuleVer(id) {
    return request.get(`defenseRuleVer/${id}`);
}
// 获取版本的防御规则列表
export async function getDefRuleVerRules(params) {
    const { id, ...rest } = params;
    return request.get(`/defenseRuleVer/${id}/defenseRules`, { params: rest });
}
// 删除防御规则
export async function delRule(id) {
    return request.delete(`/defenseRule/${id}`);
}
// 修改防御规则
export async function updateRule(params) {
    const { id, ...rest } = params;
    return request.post(`/defenseRule/${id}`, rest);
}
// 新增防御规则
export async function addRule(params) {
    const { verid, ...rest } = params;
    return request.post(`/defenseRuleVer/${verid}/defenseRule`, rest);
}
// 获取canids/nidps规则详情
export async function getDefRuleVerDetail(params) {
    return request.get(`/defenseRuleVer/detail`, { params });
}
// 获取idps规则详情
export async function getIdpsRuleVerDetail(id) {
    return request.get(`clientconfig/detail/${id}`);
}
// 获取事件类型列表
export async function getEventCategories(params) {
    return request.get('eventCategories', { params });
}
// 新增事件类型
export async function addEventCategory(params) {
    return request.post('eventCategory', params);
}
// 修改事件类型
export async function updateEventCategory(params) {
    const { id, ...rest } = params;
    return request.post(`eventCategory/${id}`, rest);
}
// 删除事件类型
export async function delEventCategory(id) {
    return request.delete(`eventCategory/${id}`);
}
// 获取事件类型菜单列表
export async function getEventCategoryMenuList(params) {
    return request.get('eventCategory/menuList', { params });
}
// 获取客户端配置
export async function getClientsConfig(params) {
    return request.get('clientconfig', { params });
}
// 新增客户端配置
export async function applyClientsConfig(params) {
    return request.post('clientconfig', params);
}
// 编辑客户端配置
export async function setClientsConfig(params) {
    const { id, ...rest } = params;
    return request.post(`clientconfig/${id}`, rest);
}
//删除客户端配置
export async function delClientsConfig(id) {
    return request.delete(`clientconfig/${id}`);
}
// 获取预警设置
export async function getNoticeSettings(params) {
    return request.get('notice', { params }).then(res => res.data);
}
// 预警设置
export async function setNoticeSettings(setting, params) {
    return request.post('notice', setting, { params });
}
// 获取已设置预警用户列表
export async function getNoticeUsers(noticeId, params) {
    return request.get(`notice/${noticeId}/user`, { params });
}
// 移除已设置预警用户
export async function removeNoticeUser(noticeId, user_id, params) {
    return request.delete(`notice/${noticeId}/user/${user_id}`, { params });
}
// 获取未设置预警用户列表
export async function getNoNoticeUsers(noticeId, params) {
    return request.get(`notice/${noticeId}/notuser`, { params });
}
// 添加预警用户
export async function setNoticeUsers(noticeId, userIds, params) {
    return request.post(`notice/${noticeId}/user`, userIds, { params });
}

////获取CanIDS配置
// export async function getCanIDS(params){
//     return request.get(`canids/getCanlist`, {params})
// }
// //新增CanIDS配置
// export async function addCanIDS(params){
//     return request.post(`canids/insertCanIDS`, params)
// }
// //编辑CanIDS配置
// export async function setCanIDS(params){
//     const {id,...rest} = params;
//     return request.post(`canids/updateCanIDS/${id}`, rest)
// }
// //删除CanIDS配置
// export async function delCanIDS(id){
//     return request.delete(`canids/deleteCanIDS/${id}`)
// }
// //发布CanIDS配置
// export async function issueCanIDS(id){
//     return request.get(`canids/publishCanIDS/${id}`)
// }
