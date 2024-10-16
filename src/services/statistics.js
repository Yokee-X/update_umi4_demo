import request from '@/utils/request';
//获取安全月报列表
export function getSafeMR(params) {
    return request.get('reportStatList',{params})
}
//导出安全月报
export function exportSafeMR(params) {
    return request.get('reportStatList/export',{params,responseType:'blob'})
}
//获取事件月报列表
export function getEventMonth(params) {
    return request.get('eventdata/monthEventStat',{params})
}
//导出事件月报
export function exportEventMonth(params) {
    return request.get('eventdataEvent/export',{params,responseType:'blob'})
}