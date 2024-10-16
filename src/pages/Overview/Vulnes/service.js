import request from '@/utils/request';
const vulnStatus ={}
// 获取顶部统计
export const getStatistic = params => {
    return request.get('vulnState/overview', { params }).then(res => res.data);
};

// 获取品牌漏洞分布
export const getBrandVuln = params => {
    return request.get('vulnState/brandVuln', { params }).then(res =>
        res.data.map(item => ({
            ...item,
            label: item.brandName,
            value: item.count
        }))
    );
};

// 获取车型漏洞排行
export const getVehicleModelTop = params => {
    return request.get('vulnState/vehicleModelVuln/top10', { params }).then(res =>
        res.data
            .map(item => ({
                ...item,
                label: item.vehicleModelName,
                value: item.count
            }))
            .slice(0, 5)
    );
};

// 获取漏洞威胁等级分布
export async function getThreatLevel(params) {
    return request.get('vulnState/threatLevel', { params }).then(res =>
        res.data.map(item => ({
            ...item,
            label: item.severityName,
            value: item.count
        }))
    );
}

// 获取零件漏洞排行
export async function getSparePartsTop(params) {
    return request.get('vulnState/deviceVuln/top10', { params }).then(res =>
        res.data.map(item => ({
            ...item,
            label: item.deviceName,
            value: item.count
        }))
    );
}

// 获取漏洞类型Top10
export async function getTypesTop(params) {
    return request.get('vulnState/type/top10', { params }).then(res =>
        res.data.map(item => ({
            ...item,
            label: item.vulnType,
            value: item.count
        }))
    );
}

// 获取漏洞状态分布
export async function getStatusScatter(params) {
    return request.get('vulnState/status', { params }).then(res =>
        res.data.map(item => ({
            ...item,
            label: vulnStatus[item.status],
            value: item.count
        }))
    );
}

// 获取漏洞列表
export async function getVulns(params) {
    return request.get('vulnProcesses', { params }).then(res => res.data);
}
