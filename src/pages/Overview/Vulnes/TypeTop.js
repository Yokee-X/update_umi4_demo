import VerticalHistogram from '@/components/Charts/VerticalHistogram';
import { Card } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getTypesTop } from './service';

const TypeTop = ({ height, intervalTime }) => {
    const { data, loading, error } = useRequest(getTypesTop, {
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    return (
        <Card title={intl.formatMessage({ id: 'overview.vulnTypeTop10' })} loading={loading}>
            <VerticalHistogram height={height} data={data} placeholder={error?.message} color={VerticalHistogram.Colors.GradientOrange} />
        </Card>
    );
};

export default TypeTop;
