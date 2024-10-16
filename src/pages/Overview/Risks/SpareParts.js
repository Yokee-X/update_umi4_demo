import VerticalHistogram from '@/components/Charts/VerticalHistogram';
import { Card } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getSpareParts } from './service';

const SpareParts = ({ height, intervalTime }) => {
    const { data, loading, error } = useRequest(getSpareParts, {
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    return (
        <Card title={intl.formatMessage({ id: 'overview.partsRiskTop10' })} loading={loading}>
            <VerticalHistogram height={height} data={data} placeholder={error?.message} color={VerticalHistogram.Colors.GradientOrange} />
        </Card>
    );
};

export default SpareParts;
