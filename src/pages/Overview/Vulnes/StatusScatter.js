import PieChart from '@/components/Charts/PieChart';
import { Card } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getStatusScatter } from './service';

const StatusScatter = ({ height, intervalTime }) => {
    const { data, loading, error } = useRequest(getStatusScatter, {
        pollingInterval: intervalTime
    });
    const intl = useIntl();
    return (
        <Card title={intl.formatMessage({ id: 'overview.vulnStatus' })} loading={loading}>
            <PieChart
                appendPadding={30}
                height={height}
                data={data}
                placeholder={error?.message}
                label={[
                    'label*value',
                    {
                        type: 'pie',
                        content: data => {
                            let res = data.label.length > 5 ? data.label.substring(0, 4) + '...：' + data.value : data.label + '：' + data.value;
                            return res;
                        }
                    }
                ]}
            />
        </Card>
    );
};

export default StatusScatter;
