import VerticalHistogram from '@/components/Charts/VerticalHistogram';
import { useOnceRequestLoading } from '@/utils/hooks';
import { Card } from 'antd';
import { useEffect } from 'react';
import { useIntl, useRequest } from 'umi';
import { getSpareParts } from './service';

const SpareParts = ({ height, filter, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getSpareParts, {
        manual: true,
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    const loading = useOnceRequestLoading(fetching);
    useEffect(() => {
        run(filter);
    }, [filter]);
    return (
        <Card title={intl.formatMessage({ id: 'overview.partsTop5' })} loading={loading}>
            <VerticalHistogram height={height} data={data} placeholder={error?.message} />
        </Card>
    );
};

export default SpareParts;
