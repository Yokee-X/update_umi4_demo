import TrendChart from '@/components/Charts/TrendChart';
import { useOnceRequestLoading } from '@/utils/hooks';
import { Card } from 'antd';
import { useEffect } from 'react';
import { useIntl, useRequest } from 'umi';
import { getAttackTrend } from './service';

const AttackTrend = ({ height, filter, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getAttackTrend, {
        manual: true,
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    const loading = useOnceRequestLoading(fetching);
    useEffect(() => {
        run(filter);
    }, [filter]);
    return (
        <Card title={intl.formatMessage({ id: 'overview.attack' })} loading={loading}>
            <TrendChart data={data} placeholder={error?.message} height={height} valueAlias={intl.formatMessage({ id: 'overview.count' })} />
        </Card>
    );
};

export default AttackTrend;
