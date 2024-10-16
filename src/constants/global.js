import moment from 'moment';
//公共禁用时间
export const disabledDate = c => {
    return c < moment('2023-1-1').startOf('d') || moment().endOf('d') < c;
};
export const DRAWER_CONFIRM_WIDTH = 489;
export const DRAWER_CONFIRM_WIDTH_BIG = 600;
