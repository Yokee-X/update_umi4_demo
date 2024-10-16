import HollowPieChart from '@/components/Charts/HollowPieChart';
import { Card } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getBrandsDistribution } from './service';

const Brand = ({ height, intervalTime }) => {
    const intl = useIntl();
    const { data = [], loading, error } = useRequest(getBrandsDistribution, { pollingInterval: intervalTime });
    return (
        <Card title={intl.formatMessage({ id: 'overview.brandRisk' })} loading={loading}>
            <HollowPieChart
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
