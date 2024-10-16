import  request from '@/utils/request'


//获取车型项目
export async function getProject(params){
    return request.get('assetLeftList',{params})
}
//获取车型项目子菜单
export async function getProjectTree(id){
    return request.get(`assetSonList/${id}`)
}
//获取资产列表
export async function getProperty(params){
    return request.get('selectRightList',{params})
}
//新增资产
export async function addProperty(params) {
    return request.post('insertRightList',params)
}
//修改资产
export async function setProperty(params) {
    return request.post('assetUpdate',params)
}
//删除资产
export async function delProperty(id) {
    return request.delete(`assetDelete/${id}`)
}
//拷贝资产
export async function copyProperty(params) {
    return request.post('copyAsset',{},{params})
}
//风险资产列表
export async function getVulnList(params){
    return request.get('vulnAsset/getList',{params})
}
//风险资产详情
export async function getVulnDetail(id){
    return request.get(`/vulnAsset/details/${id}`)
}
//风险资产忽略或加入监控
export async function setVulnStatus(params){
    const {id,...rest} = params
    return request.get(`vulnAsset/monStatus/${id}`,rest)
}
//已关联资产
export async function getAlreadyAssetList(params){
    return request.get('vulnAsset/vulnAssetList',params)
}
//未关联资产
export async function getNotAssetList(params){
    return request.get('/vulnAsset/assetList',{params})
}
//新增关联资产

export async function insertAsset(params){
    return request.post('/vulnAsset/insert',params)
}
