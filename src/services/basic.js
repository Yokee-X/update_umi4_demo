import request from '../utils/request';

// 获取省市区信息
export async function getAreas(params) {
    return request.get('areas',{params});
}
// 获取全球省市区信息
export async function getCity(params){
    return request.get('getAreaGeo',{params}).then(res=>res.data.filter(v =>(v.longitude != null && v.latitude != null)))
}