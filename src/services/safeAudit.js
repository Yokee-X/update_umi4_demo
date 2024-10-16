import request from '../utils/request';

// 获取事件审计列表
export async function getAuditEvents(params) {
    return request.get('securityAduit/eventdata', { params });
}
export function exportsAuditEvents(params = {}) {
    return request.get('/securityAduit/eventdata/export', { params, responseType: 'blob' });
}
export function checkExportsAuditEvents(data, params = {}) {
    return request.post('/securityAduit/eventdata/checkexport', data, { params, responseType: 'blob' });
}
//获取日志审计
export async function getAuditLogs(params) {
    return request.get('securityAduit/logdata', { params });
}
export function exportsAuditLogs(params = {}) {
    return request.get('/securityAduit/logdata/export', { params, responseType: 'blob' });
}
// 获取流量审计
export async function getAuditFlows(params) {
    return request.get('securityAduit/flowdata', { params });
}
export function exportsAuditFlows(params = {}) {
    return request.get('/securityAduit/flowdata/export', { params, responseType: 'blob' });
}

export async function getLogs(params) {
    return request.get('sysLog', { params });
}

export async function auditLog(params) {
    return request.post('sysLog/audit?number=2000', params);
}

export async function putFile(params) {
    return request.post('sysLog/delete?number=2000', params);
}

export async function getSECOCLogs(params) {
    return request.get('log/getLogdatas', { params });
}

export async function exportsSECOCLogs(params) {
    return request.get('log/getLogdatas/export', { params, responseType: 'blob' });
}
export async function getErrorLog(params) {
    return request.get('logError/logerrordates', { params });
}
export async function delErrorLog(params) {
    return request.delete(`logError/delete`, { params });
}

//获取can负载审计
export async function getCanloadLogs(params) {
    return request.get('securityCanload/list', { params });
}
//can负载率单日
export async function getCanloadDay(params) {
    return request.get(`/vehicleState/canTrendDay`, { params }).then(res => res.data.canload);
}
