import request from '@/utils/request';

// 获取风险预警列表
export async function getRisks(params){
    return request.get('risk',{params})
}
// 忽略风险预警
export async function ignoreRisk(id){
    return request.post(`risk/${id}/ignore`)
}
// 获取工单处理人用户
export async function getWOUsers(params){
    return request.get('userByResponseWorkRole',{params})
}
// 生成工单
export async function createWo(params){
    const {id,...rest} = params;
    return request.post(`risk/${id}/responseWork`,rest)
}
// 新增风险
export async function createRisk(params){
    return request.post('risk',params)
}
// 获取响应工单列表
export async function getResponseWorks(params){
    return request.get('responseWorks',{params})
}
// 处理工单
export async function responseWork(params){
    return request.post('responseWork',params)
}
// 添加风险预警及生成工单
export async function riskAndResponseWork(params){
    return request.post('riskAndResponseWork',params)
}
// 获取我的工单
export async function getMyWo(params) {
    return request.get('responseWorksByCurUser',{params})
}
// 获取工单详情
export async function getWoDetail(id) {
    return request.get(`responseWork/${id}`).then(res=>res.data)
}
// 接受工单
export async function receiveOrder(params) {
    return request.post(`responseWorkDeal/accept`,params)
}
// 结束工单
export async function terminateWo(params) {
    return request.post(`responseWork/end`,params)
}
