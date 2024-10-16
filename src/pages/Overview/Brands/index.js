import { useState } from 'react';
import { Col, Row } from 'antd';
import styles from './style.less';
import AttackType from './AttackType';
import AttackTrend from './AttackTrend';
import AreaChart from './AreaChart';
import SpareParts from './SpareParts';
import EventTable from './EventTable';
import Filter from './Filter';
import Header from './Header';
import ModelTop from './ModelTop';
import ThreatLevel from './ThreatLevel';
import AttackTop from './AttackTop';
import config from 'config';

const Index = () => {
    const chartInCardHeight = 254;
    const [filter, setFilter] = useState({
        dayType: 4,
        countryType: config.defaultScope == 'world' ? 1 : 2
    });
    const [eventData, setEventData] = useState(null);
    return (
        <div className={styles.container}>
            <Header filter={filter} intervalTime={config.chartRefreshInterval} />
            <Filter value={filter} onChange={setFilter} />
            {filter.brandId && (
                <div className={styles.content}>
                    <Row type={'flex'} gutter={20}>
                        <Col className={styles.left}>
                            <ThreatLevel height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                            <AttackType height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                            <AttackTrend height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                        </Col>
                        <Col className={styles.center}>
                            <AreaChart filter={filter} eventData={eventData} onChange={setFilter} intervalTime={config.chartRefreshInterval} />
                            <EventTable filter={filter} onChange={setEventData} intervalTime={config.listRefreshInterval} />
                        </Col>
                        <Col className={styles.right}>
                            <ModelTop height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                            <AttackTop height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                            <SpareParts height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default Index;
