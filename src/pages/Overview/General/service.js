import request from '@/utils/request';
import moment from 'moment';
import { EventGrades, EventGradesColor } from '@/constants/overview';
import intl from '@/locales';

export const FilterDayTypes = [
  {
    label: intl.formatMessage({ id: 'overview.filter1' }),
    value: 1,
    subsDay: 7,
  },
  {
    label: intl.formatMessage({ id: 'overview.filter2' }),
    value: 2,
    subsDay: 15,
  },
  {
    label: intl.formatMessage({ id: 'overview.filter3' }),
    value: 3,
    subsDay: 30,
  },
  {
    label: intl.formatMessage({ id: 'overview.filter4' }),
    value: 4,
    subsDay: 90,
  },
];

// 获取顶部统计
export const getStatistic = (params) => {
  return request.get('totalState/overview', { params }).then((res) => res.data);
};
// 获取攻击类型排行
export const getAttackTypeTop = (params) => {
  return request.get('totalState/attackType', { params }).then((res) => {
    return res.data
      .filter((v) => v.totalvalue != 0)
      .map((item) => ({
        ...item,
        label: item.eventCategoryName,
        value: item.totalvalue,
      }))
      .slice(0, 5);
  });
};
// 获取漏洞威胁等级分布
export async function getThreatLevel(params) {
  return request.get('totalState/threatLevel', { params }).then((res) =>
    res.data
      .filter((v) => v.totalvalue != 0)
      .map((item) => ({
        ...item,
        label: EventGrades[item.grade],
        color: EventGradesColor[item.grade],
        value: item.totalvalue,
      })),
  );
}
// 获取品牌统计
export async function getBrands(params) {
  return request.get('totalState/brandCount', { params }).then((res) =>
    res.data
      .filter((v) => v.totalvalue != 0)
      .map((item) => ({
        ...item,
        label: item.brandName,
        value: item.totalvalue,
      })),
  );
}
// 获取品牌趋势
export async function getBrandsTrend(params) {
  return request.get('totalState/brandCount', { params }).then((res) => {
    return res.data
      .filter((v) => v.totalvalue != 0)
      .map((item) => ({
        ...item,
        label: item.brandName,
        value: item.totalvalue,
      }));
  });
}
// 获取攻击趋势
export async function getAttackTrend(params) {
  return request.get('totalState/attackTrend', { params }).then((res) => {
    return res.data.map((item) => ({
      ...item,
      label: moment(item.stateDate).format('YYYY-MM-DD'),
      value: item.totalvalue,
    }));
  });
}
// 获取被攻击国家
export async function getAttackedCountryTop(params) {
  const isGlobal = params.countryType == 1;
  const completionCode = (code) => {
    if (!code) return '';
    const len = Math.max(0, 6 - code.length + 1);
    return code + Array(len).join('0');
  };
  return request.get('totalState/attacked', { params }).then((res) =>
    res.data
      .filter((v) => v.totalvalue != 0)
      .map((item) => ({
        // ...item,
        id: isGlobal ? item.stateCode : completionCode(item.provinceCode),
        label: isGlobal ? item.stateName : item.provinceName,
        value: item.totalvalue,
      })),
  );
}
// 获取零部件排行
export async function getSpareParts(params) {
  return request.get('totalState/device', { params }).then((res) => {
    return res.data
      .filter((v) => v.totalvalue != 0)
      .map((item) => ({
        ...item,
        label: item.deviceTypeName || item.deviceTypeCode,
        value: item.totalvalue,
      }));
  });
}
// 获取事件分页
export async function getEventData(params) {
  return request
    .get('securityAduit/eventdata', { params })
    .then((res) => res.data);
}
