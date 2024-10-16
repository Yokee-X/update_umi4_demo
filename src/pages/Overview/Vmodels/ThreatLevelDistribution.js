import HollowPieChart from '@/components/Charts/HollowPieChart';
import { EventGrades, EventGradesColor } from '@/constants/overview';
import { useOnceRequestLoading } from '@/utils/hooks';
import { Alert, Card, Col, Row, Tag } from 'antd';
import { useEffect, useMemo } from 'react';
import { useIntl, useRequest } from 'umi';
import { getThreatLevelDistribution } from './service';
import styles from './style.less';

const ThreatLevelDistribution = ({ height, filter, intervalTime }) => {
    const {
        run,
        data,
        loading: fetching,
        error
    } = useRequest(getThreatLevelDistribution, {
        pollingInterval: intervalTime,
        manual: true
    });
    useEffect(() => {
        run(filter);
    }, [filter]);
    const loading = useOnceRequestLoading(fetching);
    const intl = useIntl();

    const eventGridColorTag = useMemo(() => {
        return Object.keys(EventGradesColor).map(key => (
            <Tag key={key} color={EventGradesColor[key]}>
                {EventGrades[key]}
            </Tag>
        ));
    }, []);

    return (
        <Card loading={loading}>
            <div>
                <span>{intl.formatMessage({ id: 'overview.threatLevel' })}</span>
                <span className={'gutter-left_lg'}>{eventGridColorTag}</span>
            </div>
            <Row type={'flex'} gutter={12} justify="space-between">
                {error && <Alert message={error.message} type={'error'} showIcon />}
                {data?.map(item => (
                    <Col span={Math.min(24, Math.max(0, Math.floor(24 / data.length)))} key={item.name}>
                        <HollowPieChart
                            height={height}
                            data={item.data}
                            innerText={item.name}
                            legend={false}
                            color={[
                                'label*color',
                                (label, color) => {
                                    return color;
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
    );
};

export default ThreatLevelDistribution;
