import HollowPieChart from '@/components/Charts/HollowPieChart';
import { useOnceRequestLoading } from '@/utils/hooks';
import { Card } from 'antd';
import { useEffect } from 'react';
import { useIntl, useRequest } from 'umi';
import { getThreatLevel } from './service';

const ThreatLevel = ({ height, filter, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getThreatLevel, {
        manual: true,
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    const loading = useOnceRequestLoading(fetching);
    useEffect(() => {
        run(filter);
    }, [filter]);
    return (
        <Card title={intl.formatMessage({ id: 'overview.threat' })} loading={loading}>
            <HollowPieChart height={height} data={data} placeholder={error?.message} color={['label*color', (label, color) => color]} />
        </Card>
    );
};

export default ThreatLevel;
