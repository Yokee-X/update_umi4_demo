import PieChart from '@/components/Charts/PieChart';
import { Card } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getStatusScatter } from './service';

const StatusScatter = ({ height, intervalTime }) => {
    const { data, loading, error } = useRequest(getStatusScatter, {
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    return (
        <Card title={intl.formatMessage({ id: 'overview.riskStatus' })} loading={loading}>
            <PieChart height={height} data={data} placeholder={error?.message} appendPadding={20} />
        </Card>
    );
};

export default StatusScatter;
