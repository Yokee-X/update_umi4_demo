import HollowPieChart from '@/components/Charts/HollowPieChart';
import { getBrandsTrend } from '@/pages/Overview/General/service';
import { useOnceRequestLoading } from '@/utils/hooks';
import { Card } from 'antd';
import { useEffect } from 'react';
import { history, useIntl, useRequest } from 'umi';

const Brand = ({ height, filter, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getBrandsTrend, {
        manual: true,
        pollingInterval: intervalTime
    });
    const loading = useOnceRequestLoading(fetching);
    useEffect(() => {
        run(filter);
    }, [filter]);
    const intl = useIntl();

    const onClick = evt => {
        if (!evt.data?.data?.brandId) return;
        const brandId = evt.data.data.brandId;
        history.push({
            pathname: '/overview/brands',
            query: { brandId }
        });
    };

    return (
        <Card title={intl.formatMessage({ id: 'overview.brand' })} loading={loading}>
            <HollowPieChart
                onClick={onClick}
                height={height}
                data={data}
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

export default Brand;
