import PieChart from '@/components/Charts/PieChart';
import { Card } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getRiskLevelDistribution } from './service';

const RiskLevelDistribution = ({ height, intervalTime }) => {
    const { data, loading, error } = useRequest(getRiskLevelDistribution, {
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    return (
        <Card title={intl.formatMessage({ id: 'overview.riskLevel' })} loading={loading}>
            <PieChart height={height} placeholder={error?.message} data={data} />
        </Card>
    );
};

export default RiskLevelDistribution;
