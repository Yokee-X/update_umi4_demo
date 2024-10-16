import request from "@/utils/request";
//获取监控信息列表
export async function getMonitor(params){
    return request.get('monitors',{params})
}
//新增监控信息
export async function addMonitor(params){
    return request.post(`monitor`,params)
}
//修改监控信息
export async function setMonitor(params){
    const {id,...rest} = params
    return request.post(`monitor/${id}`,rest)
}
//评估监控
export async function accessMonitor(params) {
    const {id,...rest}=params
    return request.post(`/monitor/${id}/assess`,rest)
}
//获取监控信息详情
export async function detailMonitor(id){
    return request.get(`monitors/${id}`)
}
//删除监控信息
export async function delMonitor(id){
    return request.delete(`monitor/${id}`)
}

//获取事件流程列表
export async function getEvent(params){
    return request.get('eventProcesses',{params})
}
//获取事件信息
export async function getEventDetail(id,params){
    return request.get(`eventProcess/${id}`,{params})
}
//新增事件流程
export async function addEvent(params){
    return request.post('eventProcess',params)
}
//变更状态
export async function eventUpdateStatus(params){
    const {id,...rest}=params
    return request.post(`/eventProcess/${id}/updateStatus`,{},{params:rest})
}
//待分析-处理
export async function eventHandle(params){
    const {id,...rest}=params
    return request.post(`/eventProcess/${id}/handle`,rest)
}
//已配置人员-处理
export async function eventHandlePlan(params,authSecret){
    const {id,...rest}=params
    return request.post(`/eventProcess/${id}/saveHandlePlan`,rest,{params:authSecret?{authSecret}:{}})
}
//已上传处置计划-处理（更新实施进度）
export async function eventSaveImplementRecord(params,authSecret){
    const {id,...rest}=params
    return request.post(`/eventProcess/${id}/saveImplementRecord`,rest,{params:authSecret?{authSecret}:{}})
}
//已上传处置计划-处理（完成审批）
export async function eventFinishImplementRecord(params,authSecret){
    const {id,...rest}=params
    return request.post(`/eventProcess/${id}/finishImplementRecord`,rest,{params:authSecret?{authSecret}:{}})
}
//已提交领导确认-处理（确认处置完成）
export async function eventConfirmFinishHandle(id,params){
    return request.post(`/eventProcess/${id}/confirmFinishHandle`,{},{params})
}
//所有领导已确认-处理（保存跟踪记录）
export async function eventSaveTrackRecord(params){
    const {id,...rest}=params
    return request.post(`/eventProcess/${id}/saveTrackRecord`,rest)
}
//所有领导已确认-处理（结束跟踪）
export async function eventFinishTrackRecord(params){
    const {id,...rest}=params
    return request.post(`/eventProcess/${id}/finishTrack`,rest)
}
//响应关闭
export async function eventResponseClose(params){
    const {id,...rest}=params
    return request.post(`/eventProcess/${id}/isHaveRemainRisk`,rest)
}

// 延期申请
export async function eventPostpone(params){
    const {id,...rest}=params
    return request.post(`/eventProcess/${id}/delay`,rest)
}
// 延期批准
export async function eventPostponeAgree(params,authSecret){
    const {id,...rest}=params
    return request.post(`/eventProcess/${id}/delayAgree`,rest,{params:authSecret?{authSecret}:{}})
}




//获取漏洞流程列表
export async function getBug(params){
    return request.get('vulnProcesses',{params})
}
//变更状态
export async function bugUpdateStatus(params){
    const {id,...rest}=params
    return request.post(`/vulnProcess/${id}/updateStatus`,{},{params:rest})
}
//获取漏洞详情信息
export async function getBugDetail(id,params){
    return request.get(`vulnProcess/${id}`,{params})
}
//评估是否需要验证-处理
export async function bugJudgeVerify(params){
    const {id,...rest}=params
    return request.post(`/vulnProcess/${id}/judgeVerify`,rest)
}
//待验证-处理(验证)
export async function bugVerify(params,authSecret){
    const {id,...rest}=params
    return request.post(`/vulnProcess/${id}/verify`,rest,{params:authSecret?{authSecret}:{}})
}
// 待定级分发-处理(定级分发)
export async function bugGradeAndDistribute(params){
    const {id,...rest}=params
    return request.post(`/vulnProcess/${id}/gradeAndDistribute`,rest)
}
// 已定级分发-处理（判断是否需要修复）
export async function bugJudgeFix(params,authSecret){
    const {id,...rest}=params
    return request.post(`/vulnProcess/${id}/judgeFix`,rest,{params:authSecret?{authSecret}:{}})
}
//待确认方案-处理（通过）
export async function bugPass(params){
    const {id,...rest}=params
    return request.post(`/vulnProcess/${id}/pass`,rest)
}
//已确认方案-处理（判断漏洞修复状态）
export async function bugJudgeFixStatus(params,authSecret){
    const {id,...rest}=params
    return request.post(`/vulnProcess/${id}/judgeFixStatus`,rest,{params:authSecret?{authSecret}:{}})
}
// 修复待确认-处理
export async function bugFixedConfirm(params){
    const {id,...rest}=params
    return request.post(`/vulnProcess/${id}/fixedConfirm`,rest)
}
// 待确认关闭-处理
export async function bugClose(params){
    const {id,...rest}=params
    return request.post(`/vulnProcess/${id}/close`,rest)
}
// 延期申请
export async function bugPostpone(params,authSecret){
    const {id,...rest}=params
    return request.post(`/vulnProcess/${id}/postpone`,rest,{params:authSecret?{authSecret}:{}})
}


//获取漏洞上报列表
export async function getReport(params){
    return request.get('vulnReport',{params})
}
//漏洞上报
export async function setReport(params){
    return request.post('vulnReport','',{params})
}


//获取风险流程列表
export async function getRisk(params){
    return request.get('riskProcesses',{params})
}
//获取风险详情
export async function getRiskDetail(id,params){
    return request.get(`riskProcess/${id}`,{params})
}
//指定处理人
export async function riskAppoint(id,data){
    // const {id,...rest}=params
    return request.post(`/riskProcess/${id}/appointHandler`,data)
}
//待定级分析-处理
export async function riskAnalysis(params,authSecret){
    const {id,...rest}=params
    return request.post(`/riskProcess/${id}/analysisAndGrade`,rest,{params:authSecret?{authSecret}:{}})
}
//处置中-处理
export async function riskHandle(params,authSecret){
    const {id,...rest}=params
    return request.post(`/riskProcess/${id}/handleRisk`,rest,{params:authSecret?{authSecret}:{}})
}
//处置完成-处理（关闭）
export async function riskClose(params){
    const {id,...rest}=params
    return request.post(`/riskProcess/${id}/close`,rest)
}
//添加用户小组
export async function addLeaderGroup(data,type){
    return request.post(`userPermissionGroup/updateLeaderGroup/add`,data,{params:{type}})
}
//删除用户小组
export async function delLeaderGroup(data,type){
    return request.post(`userPermissionGroup/updateLeaderGroup/delete`,data,{params:{type}})
}
//获取用户小组
export async function getLeaderGroup(params){
    const {type,...rest} = params
    return request.get(`userPermissionGroup/select/${type}`,rest)
}
//补发处理人
export async function riskReissue(id,data){
    return request.post(`/riskProcess/${id}/appendHandler`,data)
}
//获取补发处理人列表
export async function riskGetReissueUser(params){
    const {id,...rest} = params
   return request.get(`/riskProcess/${id}/appendHandlerUsers`,{params:rest})
}