import HollowPieChart from '@/components/Charts/HollowPieChart';
import { useOnceRequestLoading } from '@/utils/hooks';
import { Card } from 'antd';
import { useEffect } from 'react';
import { useIntl, useRequest } from 'umi';
import { getVehicleDistribution } from './service';

const VehicleDistribution = ({ height, filter, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getVehicleDistribution, {
        pollingInterval: intervalTime,
        manual: true
    });
    const intl = useIntl();
    const loading = useOnceRequestLoading(fetching);
    useEffect(() => {
        run(filter);
    }, [filter]);

    return (
        <Card title={intl.formatMessage({ id: 'overview.modelVehicle' })} loading={loading}>
            <HollowPieChart
                appendPadding={[0, 30, 0, 40]}
                data={data}
                height={height}
                placeholder={error?.message}
                label={[
                    'label*value',
                    {
                        type: 'pie',
                        layout: { type: 'fixed-overlap' },
                        content: data => {
                            let res = data.label.length > 5 ? data.label.substring(0, 5) + '...' : data.label;
                            return res;
                        }
                    }
                ]}
            />
        </Card>
    );
};

export default VehicleDistribution;
