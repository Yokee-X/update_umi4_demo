import Histogram from '@/components/Charts/Histogram';
import VerticalHistogram from '@/components/Charts/VerticalHistogram';
import { useOnceRequestLoading } from '@/utils/hooks';
import { Card } from 'antd';
import { useEffect } from 'react';
import { useIntl, useRequest } from 'umi';
import { getAttackedCountryTop } from './service';

const SpareParts = ({ height, filter, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getAttackedCountryTop, {
        manual: true,
        pollingInterval: intervalTime
    });
    const loading = useOnceRequestLoading(fetching);
    const intl = useIntl();
    useEffect(() => {
        run(filter);
    }, [filter]);
    return (
        <Card title={intl.formatMessage({ id: 'overview.attacktop5' })} loading={loading}>
            <Histogram height={height} data={data?.slice(0, 5)} placeholder={error?.message || <></>} color={VerticalHistogram.Colors.GradientOrange} />
        </Card>
    );
};

export default SpareParts;
