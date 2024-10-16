import request, { ylRequest } from '@/utils/request';
const EventGrades ={}
//获取关联分析列表
export async function getAnalysis(params) {
    return request.get('complexAttackConfig', { params });
}
//获取关联分析详情
export async function getAnalysisDetail(id) {
    return request.get(`/complexAttackConfig/${id}`);
}
//获取攻击规则列表
export async function getComplexAttackConfigBasic(data) {
    return request.get('complexAttackConfigGetBasic', data).then(v => {
        v.data = v.data.filter(i => i.code.length == 6);
        return v;
    });
}
//修改、新增关联分析列表
export async function setAnalysis(params) {
    const { id, ...rest } = params;
    return id ? request.post(`complexAttackConfig/${id}`, rest) : request.post('complexAttackConfig', params);
}
//删除关联分析列表
export async function delAnalysis(id) {
    return request.delete(`complexAttackConfig/${id}`);
}
//修改关联分析状态
export async function changeAnalysisStatus(id, status) {
    return request.post(`complexAttackConfig/${id}/${status}`);
}
//获取复杂攻击列表
export async function getComplexAttack(params) {
    return request.get('complexAttack', { params });
}
//获取基础攻击列表
export async function getBasicAttack(id) {
    return request.get(`complexAttack/getBasicAttack/${id}`);
}
//获取攻击链
export async function getAttackChain(id) {
    return request.get(`complexAttack/getAttackChain/${id}`);
}
//获取攻击链-新
export async function getAttackChainNew(id) {
    return request.get(`complexAttack/getAttackChainNew/${id}`);
}
//获取品牌态势
export async function getBrandStatus(params) {
    return request.get(`complexAttack/getBrandStatus`, { params });
}
// 获取车型态势
export async function getVehicleModelStatus(params) {
    return request.get(`complexAttack/getVehicleModelStatus`, { params });
}
// 获取复杂攻击类型
export async function getAttackCategoryStatus(params) {
    return request.get(`complexAttack/getAttackCategoryStatus`, { params });
}
//获取复杂攻击趋势
export async function getAttackTrend(params) {
    return request.get(`complexAttack/getAttackTrend`, { params });
}

//获取风险资产列表
export async function getRisk(params) {
    return request.get('vulnAsset/getList', { params });
}
//获取风险资产列表详情
export async function getRiskDetail(id) {
    return request.get(`vulnAsset/details/${id}`);
}
//忽略
export async function ignoreRiskStatus(params) {
    const { id, status } = params;
    return request.get(`vulnAsset/monStatus/${id}`, { params: { status } });
}
//加入监控信息
export async function addRiskMonitor(params) {
    const { id, status } = params;
    return request.get(`vulnAsset/monStatus/${id}`, { params: { status } });
}
//新增关联风险资产
export async function insertRisk(body, params) {
    return request.post('vulnAsset/insert', body, { params });
}
//删除关联风险资产
export async function deleteRisk(params) {
    return request.delete('vulnAsset/delete', { params });
}
//已关联风险资产列表
export async function getAlreadyAssetList(params) {
    return request.get(`vulnAsset/vulnAssetList`, { params });
}
//未关联风险资产列表
export async function getAssetList(params) {
    return request.get(`vulnAsset/assetList`, { params });
}
//获取攻击源ip列表
export async function getIpAttack(params) {
    return request.get('ipAttackSrcList', { params });
}
//获取攻击源ip详情
export async function getIpAttackDetail(params) {
    return request.get('ipAttackSrc/detail', { params });
}
//获取攻击源ip饼图
export async function getIpAttackPie(params) {
    return request.get('ipAttackSrc/counts', { params }).then(res => {
        Object.keys(res.data).forEach(key => {
            let arr = [];
            if (key != 'cityCount' && key != 'provinceCount') {
                Object.keys(res.data[key]).map(item => {
                    if (key == 'gradeCount') {
                        arr.push({ label: EventGrades[item], value: res.data[key][item] });
                    } else {
                        arr.push({ label: item, value: res.data[key][item] });
                    }
                });
                if (key == 'eventCategoryCount') {
                    arr = arr.sort((a, b) => b.value - a.value);
                    let obj = { label: '其他', value: 0 };
                    arr.slice(5).forEach(v => (obj.value += v.value));
                    arr = arr.slice(0, 5);
                    arr.push(obj);
                    arr = arr.filter(v => v.value > 0);
                }
                res.data[key] = arr;
            } else if (key == 'provinceCount') {
                res.data[key] = res.data[key]?.map(v => {
                    const k = Object.keys(v)[0];
                    v.label = k;
                    v.value = v[k];
                    return v;
                });
            }
        });
        return res.data;
    });
}
//获取攻击源分析被攻击车辆
export async function getAttackVehicle(params) {
    return request.get('ipAttackSrc/attackedVehicle', { params });
}
