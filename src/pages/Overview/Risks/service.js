import request from '@/utils/request';
import { RiskLevel } from '@/constants/overview';
const riskStatus={}
// 获取顶部统计
export const getStatistic = params => {
    return request.get('riskState/overview', { params }).then(res => res.data);
};

// 获取品牌风险分布
export const getBrandsDistribution = params => {
    return request.get('riskState/brandRisk', { params }).then(res =>
        res.data.map(item => ({
            ...item,
            label: item.brandName,
            value: item.count
        }))
    );
};

// 获取车型风险排行TOP10
export async function getVehicleModelTop(params) {
    return request.get('riskState/vehicleModelRisk/top10', { params }).then(res =>
        res.data
            .map(item => ({
                ...item,
                label: item.vehicleModelName,
                value: item.count
            }))
            .slice(0, 5)
    );
}

// 获取车型风险等级分布
export async function getRiskLevelDistribution(params) {
    return request.get('riskState/threatLevel', { params }).then(res =>
        res.data.map(item => ({
            ...item,
            label: RiskLevel[item.riskLevel] || item.riskLevel,
            value: item.count
        }))
    );
}

// 获取零部件风险排行Top5
export async function getSpareParts(params) {
    return request.get('riskState/deviceRisk/top5', { params }).then(res =>
        res.data
            .map(item => ({
                ...item,
                label: '（' + item.vehicleModelName + '-' + item.name + '）' + item.deviceName,
                value: item.count
            }))
            .slice(0, 10)
    );
}

// 获取风险状态分布
export async function getStatusScatter(params) {
    return request.get('riskState/status', { params }).then(res =>
        res.data.map(item => ({
            ...item,
            label: riskStatus[item.status] || item.status,
            value: item.count
        }))
    );
}

export async function getTableData(params) {
    return request.get('riskProcesses', { params }).then(res => res.data);
}
