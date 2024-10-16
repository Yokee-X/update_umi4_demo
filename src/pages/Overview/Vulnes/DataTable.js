import DateFormat from '@/components/DateFormat';
import Ellipsis from '@/components/Ellipsis';
import ScrollingTable from '@/components/ScrollingTable';
import { message } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getVulns } from './service';
import styles from './style.less';
const vulnStatus ={}
const DataTable = ({ intervalTime }) => {
    const intl = useIntl();
    const { data = [], loading } = useRequest(
        () =>
            getVulns({
                pageSize: 50
            }),
        { onError: e => message.error(e.message), pollingInterval: intervalTime }
    );
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
            title: intl.formatMessage({ id: 'safeAudit.date' }),
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
            render: (data, col) => (
                <span style={classShow(col.createDate)}>
                    <Ellipsis length={20} tooltip>
                        {data?.map(item => item.brandName + item.vehicleModelName + '-' + item.modelName + ' ' + item.deviceName + (item.hardName ? '_' + item.hardName : '') + (item.sysName ? '_' + item.sysName : '') + (item.cpName ? '_' + item.cpName : '')).join('，')}
                    </Ellipsis>
                </span>
            )
        },
        {
            title: intl.formatMessage({ id: 'vuln.vulnName' }),
            dataIndex: 'vulnName',
            render: (v, col) => (
                <span style={classShow(col.createDate)}>
                    <Ellipsis length={20} tooltip>
                        {v}
                    </Ellipsis>
                </span>
            )
        },
        {
            title: intl.formatMessage({ id: 'vuln.vulnId' }),
            dataIndex: 'vulnNum',
            render: (v, col) => (
                <span style={classShow(col.createDate)}>
                    <Ellipsis length={20} tooltip>
                        {v}
                    </Ellipsis>
                </span>
            )
        },
        {
            title: intl.formatMessage({ id: 'vuln.vulnLevel' }),
            dataIndex: 'vulnLevel',
            render: (v, col) => <span style={classShow(col.createDate)}>{v}</span>
        },
        {
            title: intl.formatMessage({ id: 'vuln.vulnType' }),
            dataIndex: 'vulnType',
            render: (v, col) => <span style={classShow(col.createDate)}>{v}</span>
        },
        {
            title: intl.formatMessage({ id: 'safeMonitor.status' }),
            dataIndex: 'status',
            render: (v, col) => <span style={classShow(col.createDate)}>{vulnStatus[v]}</span>
        }
    ];
    return <ScrollingTable className={styles.table} loading={loading} columns={columns} dataSource={data} pagination={false} rowKey={'id'} scrollHeight={573} />;
};

export default DataTable;
