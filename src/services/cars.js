import request from '@/utils/request';

// 获取汽车品牌列表
export async function getBrands(params) {
    return request.get('brands', { params });
}
// 获取tsp汽车品牌列表
export async function getAllBrands(params) {
    return request.get('tsp/getAllBrand', { params });
}
// 获取tsp汽车所有车系
export async function getVehicleModelList(params) {
    return request.get('tsp/getVehicleModelList', { params });
}
// 获取tsp汽车所有车系款式
export async function getModelList(params) {
    return request.get('tsp/getModelList', { params });
}

// 获取汽车品牌详情
export async function getBrandDetail(id) {
    return request.get(`brands/${id}`);
}
// 创建汽车品牌
export async function newBrand(params) {
    return request.post('brand', params);
}
// 修改汽车品牌
export async function updateBrand(params) {
    const { id, ...rest } = params;
    return request.post(`brand/${id}`, rest);
}
// 删除汽车品牌
export async function delBrand(id) {
    return request.delete(`brand/${id}`);
}
// 品牌增加管理员
export async function addBrandsManager(brand_id, user_id) {
    return request.post(`brand/${brand_id}/manager`, { user_id });
}
// 品牌移除管理员
export async function removeBrandsManager(brand_id, user_id) {
    return request.delete(`brand/${brand_id}/manager/${user_id}`);
}
// 获取车型列表
export async function getModels(params) {
    return request.get('vehicleModels', { params });
}
// 获取子类型
export async function getSubModels(params) {
    return request.get('models', { params });
}
// 新增子类型
export async function addSubModels(params) {
    return request.post('model', params);
}
// 编辑子类型
export async function updateSubModels(params) {
    const { id, ...rest } = params;
    return request.post(`model/${id}`, rest);
}
//复制子类型
export async function copySubModels(params, sourceModelId) {
    return request.post('model/copyModel', params, { params: { sourceModelId } });
}
// 删除子类型
export async function delSubModels(id) {
    return request.delete(`model/${id}`);
}
// 删除车型
export async function delModel(id) {
    return request.delete(`vehicleModel/${id}`);
}
// 编辑车型
export async function updateModel(params) {
    const { id, ...rest } = params;
    return request.post(`vehicleModel/${id}`, rest);
}
// 新增车型
export async function newModel(params) {
    return request.post('vehicleModel', params);
}
// 车型详情
export async function getModelDetail(id) {
    return request.get(`model/${id}`);
}
// 车型增加管理员
export async function addModelsManager(model_id, user_id) {
    return request.post(`vehicleModel/${model_id}/manager`, { user_id });
}
// 车型移除管理员
export async function removeModelsManager(model_id, user_id) {
    return request.delete(`vehicleModel/${model_id}/manager/${user_id}`);
}
// 获取车型项目设备
export async function getModelDevices(params) {
    return request.get('modelDevices', { params });
}
// 获取车型项目设备的防火墙配置
export async function getModelDeviceFirewalls(modelDeviceId) {
    return request.get(`modelDevice/${modelDeviceId}/firewall`);
}
// 获取车型项目未配置的设备的防火墙
export async function getModelDeviceUnselectedFirewalls(modelDeviceId) {
    return request.get(`modelDevice/${modelDeviceId}/unselectedFirewallRules`);
}
//生成NIDPS配置
export async function getModelDeviceNidps(params) {
    return request.post(`modelDevice/getNidps`, {}, { params });
}
// 配置车型防火墙规则
export async function setModelDevicesFirewall(params) {
    return request.post('modelDeviceFirewallRule', params);
}
// 获取车型项目设备的其他防御规则配置
export async function getModelDeviceDefRules(modelDeviceId) {
    return request.get(`modelDevice/${modelDeviceId}/defenseRule`);
}
// 获取车型项目设备未配置的网络防御规则配置
export async function getModelDeviceUnselectedNetworkRules(params) {
    const { modelDeviceId, ...rest } = params;
    return request.get(`modelDevice/${modelDeviceId}/unselectedDefenseRuleVers`, { params: rest });
}
// 设置车型项目设备网络防御规则
export async function setModelDeviceNetworkRule(params) {
    return request.post('modelDeviceDefenseRuleVer', params);
}
// 设置车型项目设备IDPS规则
export async function setModelDeviceIdpsRule(params) {
    const { id, modelDeviceId } = params;
    return request.post(`modelDeviceConfig/${id}`, { id: modelDeviceId });
}
//展示车型项目设备IDPS规则
export async function getModelDeviceIdpsRules(id) {
    return request.get(`getmodelDeviceConfig`, { params: { id } });
}
//展示车型项目设备CAN/CANFD列表
export async function getModelDeviceCanConfig(params) {
    return request.get(`modeDevice/canLoadList`, { params });
}
//修改新增车型项目设备CAN/CANFD列表
export async function updateModelDeviceCanConfig(params) {
    const { id, ...rest } = params;
    return id ? request.post(`modeDevice/updateCanLoad`, rest, { params: { id } }) : request.post(`modeDevice/insertCanLoad`, params);
}
//删除车型项目设备CAN/CANFD列表
export async function delModelDeviceCanConfig(id) {
    return request.delete(`modeDevice/deleteCanLoad`, { params: { id } });
}
//获取配置防火墙规则历史版本
export async function getModelDevicesFirewallHistory(params) {
    return request.get('modelDeviceFirewallRule/history', { params });
}
//获取设备配置防御规则历史版本
export async function getModelDeviceRuleHistory(params) {
    return request.get(`modelDeviceDefenseRule/history`, { params });
}
//比较设备配置防御规则历史版本
export async function getModelDeviceRuleCompare(params) {
    return request.get(`modelDeviceDefenseRule/compare`, { params });
}
//获取NIDPS历史记录
export async function getEthernetHistory(params) {
    return request.get('modelDeviceDefenseRule/ethernetHistory', { params });
}
//获取NIDPS历史记录详情
export async function getEthernetDetail(params) {
    return request.get('modelDeviceDefenseRule/ethernetDetail', { params });
}

// 新增车型设备
export async function addModelDevice(params) {
    return request.post('modelDevice', params);
}
// 修改车型设备
export async function updateModelDevice(params) {
    const { id, ...rest } = params;
    return request.post(`modelDevice/${id}`, rest);
}
// 删除车型设备
export async function delModelDevice(id) {
    return request.delete(`modelDevice/${id}`);
}

// 获取车辆信息列表
export async function getCars(params) {
    return request.get('/vehicles', { params });
}
// 获取车辆详情
export async function getCarDetail(id) {
    return request.get(`/vehicle/${id}`);
}
// 新增车辆
export async function addVehicle(params) {
    return request.post('vehicle/addVehicleInfo', params);
}
//导入车辆
export async function importVehicle(params, file) {
    return request.post('vehicle/importVehicleInfo', file, { params });
}
