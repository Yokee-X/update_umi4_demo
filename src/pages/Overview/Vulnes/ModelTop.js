import VerticalHistogram from '@/components/Charts/VerticalHistogram';
import { Card } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getVehicleModelTop } from './service';

const ModelTop = ({ height, intervalTime }) => {
    const { data, loading, error } = useRequest(getVehicleModelTop, {
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    return (
        <Card title={intl.formatMessage({ id: 'overview.vehicleVulnTop5' })} loading={loading}>
            <VerticalHistogram height={height} data={data} placeholder={error?.message} color={VerticalHistogram.Colors.GradientOrange} />
        </Card>
    );
};

export default ModelTop;
