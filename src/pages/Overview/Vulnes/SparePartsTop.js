import VerticalHistogram from '@/components/Charts/VerticalHistogram';
import { Card } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getSparePartsTop } from './service';

const SparePartsTop = ({ height, intervalTime }) => {
    const { data, loading, error } = useRequest(getSparePartsTop, {
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    return (
        <Card title={intl.formatMessage({ id: 'overview.partsVulnTop10' })} loading={loading}>
            <VerticalHistogram height={height} data={data} placeholder={error?.message} color={VerticalHistogram.Colors.GradientOrange} />
        </Card>
    );
};

export default SparePartsTop;
