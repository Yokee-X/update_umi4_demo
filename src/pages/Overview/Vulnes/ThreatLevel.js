import PieChart from '@/components/Charts/PieChart';
import { Card } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getThreatLevel } from './service';

const ThreatLevel = ({ height, intervalTime }) => {
    const { data, loading, error } = useRequest(getThreatLevel, {
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    return (
        <Card title={intl.formatMessage({ id: 'overview.vulnThreatLevel' })} loading={loading}>
            <PieChart height={height} data={data} placeholder={error?.message} />
        </Card>
    );
};

export default ThreatLevel;
