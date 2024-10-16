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
        manual: true,
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    const loading = useOnceRequestLoading(fetching);
    useEffect(() => {
        run(filter);
    }, [filter]);
    return (
        <Card title={intl.formatMessage({ id: 'overview.attackTypeTop5' })} loading={loading}>
            <VerticalHistogram height={height} data={data} color={VerticalHistogram.Colors.GradientOrange} placeholder={error?.message} />
        </Card>
    );
};

export default AttackType;
