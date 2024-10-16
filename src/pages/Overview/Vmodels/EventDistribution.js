import HollowPieChart from '@/components/Charts/HollowPieChart';
import { useOnceRequestLoading } from '@/utils/hooks';
import { Card } from 'antd';
import { useEffect } from 'react';
import { useIntl, useRequest } from 'umi';
import { getEventDistribution } from './service';

const EventDistribution = ({ height, filter, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getEventDistribution, {
        pollingInterval: intervalTime,
        manual: true
    });
    const loading = useOnceRequestLoading(fetching);
    useEffect(() => {
        run(filter);
    }, [filter]);
    const intl = useIntl();

    return (
        <Card title={intl.formatMessage({ id: 'overview.modelEvent' })} loading={loading}>
            <HollowPieChart
                appendPadding={30}
                data={data}
                height={height}
                placeholder={error?.message}
                label={[
                    'label*value',
                    {
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

export default EventDistribution;
