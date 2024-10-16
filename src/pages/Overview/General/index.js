import { useState } from 'react';
import { Col, Row } from 'antd';
import styles from './style.less';
import AttackType from './AttackType';
import AttackTrend from './AttackTrend';
import AreaChart from './AreaChart';
import Brand from './Brand';
import AttackTop from './AttackTop';
import SpareParts from './SpareParts';
import AttackTable from './AttackTable';
import Filter from './Filter';
import Header from './Header';
import ThreatLevel from './ThreatLevel';
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
            <div className={styles.content}>
                <Row type={'flex'} gutter={20}>
                    <Col className={styles.left}>
                        <ThreatLevel height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                        <AttackType height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                        <AttackTrend height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                    </Col>
                    <Col className={styles.center}>
                        <Filter value={filter} onChange={setFilter} />
                        <AreaChart filter={filter} intervalTime={config.chartRefreshInterval} eventData={eventData} onChange={setFilter} />
                        <AttackTable filter={filter} intervalTime={config.listRefreshInterval} onChange={setEventData} />
                    </Col>
                    <Col className={styles.right}>
                        <Brand height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                        <AttackTop height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                        <SpareParts height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Index;
