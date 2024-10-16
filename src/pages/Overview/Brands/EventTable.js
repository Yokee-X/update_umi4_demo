import DateFormat from '@/components/DateFormat';
import Ellipsis from '@/components/Ellipsis';
import ScrollingTable from '@/components/ScrollingTable';
import { message } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl, useRequest } from 'umi';
import { FilterDayTypes, getEventData } from './service';
import styles from './style.less';
const EventGrades= {}
const EventTable = ({ filter, onChange, intervalTime }) => {
    const { run, data, loading } = useRequest(getEventData, {
        manual: true,
        pollingInterval: intervalTime,
        onError: e => message.error(e.message),
        onSuccess: res => onChange(res)
    });
    const intl = useIntl();
    useEffect(() => {
        const offsetDay = FilterDayTypes.find(n => n.value == filter.dayType);
        const params = {
            brand_id: filter.brandId,
            pageIndex: 1,
            pageSize: 50,
            endDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
        };
        if (offsetDay) {
            params.startDate = moment().startOf('day').subtract(offsetDay.subsDay, 'day').format('YYYY-MM-DD HH:mm:ss');
        }
        run(params);
    }, [filter]);
    const classShow = time => {
        let now = new Date().getTime();
        let diff = now - time;
        if (diff <= 60 * 1000 * 10 && diff > 0) {
            return {
                color: '#FF8C00',
                fontWeight: 'bold'
            };
        }
    };
    const columns = [
        {
            title: intl.formatMessage({ id: 'property.vehicleModel' }),
            dataIndex: 'vehicleModelName',
            render: (v, col) => (
                <span style={classShow(col.eventtime)}>
                    <Ellipsis tooltip length={20}>
                        {v}
                    </Ellipsis>
                </span>
            )
        },
        {
            title: intl.formatMessage({ id: 'property.project' }),
            dataIndex: 'modelName',
            render: (v, col) => (
                <span style={classShow(col.eventtime)}>
                    <Ellipsis tooltip length={20}>
                        {v}
                    </Ellipsis>
                </span>
            )
        },
        {
            title: 'VIN',
            dataIndex: 'vin',
            render: (v, col) => <span style={classShow(col.eventtime)}>{v}</span>
        },
        {
            title: intl.formatMessage({ id: 'overview.parts' }),
            dataIndex: 'modelDeviceName',
            render: (v, col) => <span style={classShow(col.eventtime)}>{v}</span>
        },
        {
            title: intl.formatMessage({ id: 'safeAudit.attackType' }),
            dataIndex: 'eventcategoryName',
            render: (v, col) => <span style={classShow(col.eventtime)}>{v}</span>
        },
        {
            title: intl.formatMessage({ id: 'overview.vehicleSite' }),
            key: 'car_address',
            render(col) {
                return (
                    <div style={classShow(col.eventtime)}>
                        {col.state} {col.province} {col.city}
                    </div>
                );
            }
        },
        {
            title: intl.formatMessage({ id: 'overview.attackSite' }),
            key: 'attack_address',
            render(col) {
                let r = [col.stateSrc, col.provinceSrc, col.citySrc].filter(n => !!n).join(' ');
                if (r) return <div style={classShow(col.eventtime)}>{r}</div>;
                return <div style={classShow(col.eventtime)}>{col.state + ' ' + col.province + ' ' + col.city}</div>;
            }
        },
        {
            title: intl.formatMessage({ id: 'safeAudit.threatLevel' }),
            dataIndex: 'grade',
            render: (v, col) => <span style={classShow(col.eventtime)}>{EventGrades[v]}</span>
        },
        {
            title: intl.formatMessage({ id: 'analysis.time' }),
            dataIndex: 'eventtime',
            render(val) {
                return (
                    <span style={classShow(val)}>
                        <DateFormat date={val} format={'YYYY-MM-DD HH:mm:ss'} />
                    </span>
                );
            }
        }
    ];
    return <ScrollingTable loading={loading} columns={columns} dataSource={data} pagination={false} className={styles.attackTable} rowKey={(n, i) => i} scrollHeight={310} />;
};

export default EventTable;
