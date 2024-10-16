import { useOnceRequestLoading } from '@/utils/hooks';
import { Card } from 'antd';
import { Chart, Legend, LineAdvance } from 'bizcharts';
import { useEffect } from 'react';
import { useIntl, useRequest } from 'umi';
import { getSparePartsTrend } from './service';

const SparePartsTrend = ({ height, filter, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getSparePartsTrend, {
        pollingInterval: intervalTime,
        manual: true
    });
    const loading = useOnceRequestLoading(fetching);
    useEffect(() => {
        run(filter);
    }, [filter]);
    const intl = useIntl();

    return (
        <Card title={intl.formatMessage({ id: 'overview.partsTrend' })} loading={loading}>
            <Chart height={height} padding={[30, 40, 20, 50]} data={data} autoFit placeholder={error?.message}>
                <LineAdvance shape="smooth" position="date*value" color="type" />
                <Legend visible={true} position={'top-center'} />
            </Chart>
        </Card>
    );
};

export default SparePartsTrend;
