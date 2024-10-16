import HollowPieChart from '@/components/Charts/HollowPieChart';
import { useOnceRequestLoading } from '@/utils/hooks';
import { Alert, Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useRequest } from 'umi';
import { getAttackTypeDistribution } from './service';
import styles from './style.less';

const AttackTypeDistribution = ({ height, filter, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getAttackTypeDistribution, {
        pollingInterval: intervalTime,
        manual: true
    });
    useEffect(() => {
        run(filter);
    }, [filter]);
    const loading = useOnceRequestLoading(fetching);

    return (
        <>
            <Card loading={loading}>
                <div style={{ height: 22 }}></div>
                {error && <Alert message={error.message} type={'error'} showIcon />}
                <Row type={'flex'} gutter={12} justify="space-between">
                    {data?.map(item => (
                        <Col span={Math.min(24, Math.max(0, Math.floor(24 / data.length)))} key={item.name}>
                            <HollowPieChart
                                data={item.data}
                                height={height}
                                innerText={item.name}
                                appendPadding={20}
                                label={[
                                    'label*value',
                                    {
                                        content: data => {
                                            let res = `${data.label}: ${data.value}`.length > 5 ? `${data.label}: ${data.value}`.substring(0, 5) + '...' : `${data.label}: ${data.value}`;
                                            return res;
                                        }
                                    }
                                ]}
                                placeholder={
                                    <div className={styles.pieChartPlaceHolder}>
                                        <label>{item.name}</label>
                                    </div>
                                }
                            />
                        </Col>
                    ))}
                </Row>
            </Card>
        </>
    );
};

export default AttackTypeDistribution;
