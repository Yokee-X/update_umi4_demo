import VerticalHistogram from '@/components/Charts/VerticalHistogram';
import { useOnceRequestLoading } from '@/utils/hooks';
import { Card } from 'antd';
import { useEffect } from 'react';
import { useIntl, useRequest } from 'umi';
import { getAttackTypeTop } from './service';

const AttackType = ({ height, filter, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getAttackTypeTop, {
        pollingInterval: intervalTime,
        manual: true
    });
    const intl = useIntl();
    useEffect(() => {
        run(filter);
    }, [filter]);
    const loading = useOnceRequestLoading(fetching);
    return (
        <Card title={intl.formatMessage({ id: 'overview.attackTypeTop5' })} loading={loading}>
            <VerticalHistogram height={height} data={data} placeholder={error?.message} color={VerticalHistogram.Colors.GradientOrange} />
        </Card>
    );
};

export default AttackType;
