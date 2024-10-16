import request from '@/utils/request';
import { EventGrades, EventGradesColor } from '@/constants/overview';
import moment from 'moment';
import intl from '@/locales';

export const FilterDayTypes = [
    {
        label: intl.formatMessage({ id: 'overview.filter1' }),
        value: 1,
        subsDay: 7
    },
    {
        label: intl.formatMessage({ id: 'overview.filter2' }),
        value: 2,
        subsDay: 15
    },
    {
        label: intl.formatMessage({ id: 'overview.filter3' }),
        value: 3,
        subsDay: 30
    },
    {
        label: intl.formatMessage({ id: 'overview.filter4' }),
        value: 4,
        subsDay: 90
    }
];

// 获取顶部统计
export const getStatistic = params => {
    return request.get('vehicleModelState/overview', { params }).then(res => res.data);
};

// 项目车辆分布
export const getVehicleDistribution = params => {
    return request.get('vehicleModelState/model/vehicle?', { params }).then(res =>
        res.data.map(item => ({
            ...item,
            label: item.modelName,
            value: item.totalvalue
        }))
    );
};

// 项目事件分布
export async function getEventDistribution(params) {
    return request.get('vehicleModelState/model/eventData', { params }).then(res =>
        res.data.map(item => ({
            ...item,
            label: item.modelName,
            value: item.totalvalue
        }))
    );
}

// 零部件趋势
export async function getSparePartsTrend(params) {
    return request.get('vehicleModelState/deviceTrend?', { params }).then(res => {
        let data = [];
        res.data.forEach(type => {
            Object.values(type).forEach(arr => {
                arr.forEach(item => {
                    item.date = moment(item.statedate).format('YYYY-MM-DD');
                    item.value = item.totalvalue;
                    item.type = item.deviceTypeCode;
                    data.push(item);
                });
            });
        });
        return data;
    });
}

// 威胁等级分布
export async function getThreatLevelDistribution(params) {
    return request.get('vehicleModelState/threatLevel', { params }).then(res => {
        const data = [];
        res.data.forEach(obj => {
            Object.keys(obj).forEach(key => {
                const items = obj[key];
                data.push({
                    name: key,
                    data: items
                        .filter(v => v.totalvalue != 0)
                        .map(item => ({
                            ...item,
                            label: EventGrades[item.grade] || item.grade,
                            value: item.totalvalue,
                            color: EventGradesColor[item.grade]
                        }))
                });
            });
        });
        return data;
    });
}

// 攻击类型分布
export async function getAttackTypeDistribution(params) {
    return request.get('vehicleModelState/attack', { params }).then(res => {
        const data = [];
        res.data.forEach(obj => {
            Object.keys(obj).forEach(key => {
                let items = obj[key].filter(v => v.totalvalue > 0);
                let arr = items.slice(0, 5);
                if (items.length > 5) {
                    let temp = { name: intl.formatMessage({ id: 'overview.other' }), totalvalue: 0, id: new Date().getTime() };
                    items.slice(5).forEach(item => {
                        temp.totalvalue += item.totalvalue;
                    });
                    arr.push(temp);
                }
                data.push({
                    name: key,
                    data: arr.map(item => ({
                        ...item,
                        label: item.name,
                        value: item.totalvalue
                    }))
                });
            });
        });
        return data;
    });
}
