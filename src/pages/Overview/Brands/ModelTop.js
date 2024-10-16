import VerticalHistogram from '@/components/Charts/VerticalHistogram';
import { useOnceRequestLoading } from '@/utils/hooks';
import { Card } from 'antd';
import { useEffect } from 'react';
import { history, useIntl, useRequest } from 'umi';
import { getVehicleTypeTop } from './service';

const ModelTop = ({ filter, height, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getVehicleTypeTop, {
        pollingInterval: intervalTime,
        manual: true
    });
    useEffect(() => {
        run(filter);
    }, [filter]);
    const loading = useOnceRequestLoading(fetching);
    const intl = useIntl();

    const onClick = evt => {
        if (!evt.data?.data?.id) return;
        const vehicleModleId = evt.data.data.id;
        history.push({
            pathname: '/overview/vmodels',
            query: { vehicleModleId }
        });
    };
    return (
        <Card title={intl.formatMessage({ id: 'overview.vehicleTop5' })} loading={loading}>
            <VerticalHistogram onClick={onClick} height={height} data={data} placeholder={error?.message} color={VerticalHistogram.Colors.GradientBlue} />
        </Card>
    );
};

export default ModelTop;
