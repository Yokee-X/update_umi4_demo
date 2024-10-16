import DateFormat from '@/components/DateFormat';
import ScrollingTable from '@/components/ScrollingTable';
import { RiskLevel } from '@/constants/overview';
import { message, Tooltip } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getTableData } from './service';
const riskStatus={}
const DataTable = ({ intervalTime }) => {
    const { data = [], loading } = useRequest(getTableData, {
        onError: e => message.error(e.message),
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    const classShow = time => {
        let now = new Date().getTime();
        let diff = now - new Date(time);
        if (diff <= 60 * 1000 * 10 && diff > 0) {
            return {
                color: '#FF8C00',
                fontWeight: 'bold'
            };
        }
    };
    const columns = [
        {
            title: intl.formatMessage({ id: 'safeMonitor.personName' }),
            dataIndex: ['monitor', 'reporterName'],
            render: (v, col) => <span style={classShow(col.createDate)}>{v}</span>
        },
        {
            title: intl.formatMessage({ id: 'safeMonitor.informationDesc' }),
            dataIndex: ['monitor', 'description'],
            ellipsis: true,
            render: (v, col) => (
                <Tooltip title={v} placement="topLeft">
                    <span style={classShow(col.createDate)}>{v}</span>
                </Tooltip>
            )
        },
        {
            title: intl.formatMessage({ id: 'safeMonitor.receiptTime' }),
            dataIndex: 'createDate',
            render: (date, col) => (
                <span style={classShow(col.createDate)}>
                    <DateFormat date={date} />
                </span>
            )
        },
        {
            title: intl.formatMessage({ id: 'safeMonitor.involveAsset' }),
            dataIndex: ['monitor', 'assetList'],
            ellipsis: true,
            render: (data, col) => {
                let v = data.map(item => item.brandName + ' ' + item.vehicleModelName + '-' + item.modelName + ' ' + item.assetName + '，');
                return (
                    <Tooltip title={v} placement="topLeft">
                        <span style={classShow(col.createDate)}>{v}</span>
                    </Tooltip>
                );
            }
        },
        {
            title: intl.formatMessage({ id: 'safeMonitor.riskLevel' }),
            dataIndex: 'riskLevel',
            render: (v, col) => <span style={classShow(col.createDate)}>{RiskLevel[v]}</span>
        },
        {
            title: intl.formatMessage({ id: 'safeMonitor.status' }),
            dataIndex: 'status',
            render: (v, col) => <span style={classShow(col.createDate)}>{riskStatus[v]}</span>
        }
    ];
    return <ScrollingTable loading={loading} columns={columns} dataSource={data} pagination={false} rowKey={'id'} scrollHeight={579} />;
};

export default DataTable;
