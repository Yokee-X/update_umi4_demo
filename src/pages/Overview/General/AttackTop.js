import Histogram from '@/components/Charts/Histogram';
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
        pollingInterval: intervalTime,
        formatResult: res => {
            return res.slice(0, 5);
        }
    });
    const intl = useIntl();
    const loading = useOnceRequestLoading(fetching);
    useEffect(() => {
        run(filter);
    }, [filter]);
    return (
        <Card title={intl.formatMessage({ id: 'overview.attacktop5' })} loading={loading}>
            <Histogram height={height} data={data} placeholder={error?.message} color={Histogram.Colors.GradientOrange} />
        </Card>
    );
};

export default SpareParts;
