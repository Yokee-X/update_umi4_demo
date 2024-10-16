import { useEffect, useState } from 'react';
import styles from './style.less';
import Header from './Header';
import { Col, Row, Tabs } from 'antd';
import Filter from './Filter';
import VehicleDistribution from './VehicleDistribution';
import EventDistribution from './EventDistribution';
import SparePartsTrend from './SparePartsTrend';
import ThreatLevelDistribution from './ThreatLevelDistribution';
import ThreatLevelAll from './ThreatLevelAll';
import AttackTable from './AttackTable';
import AttackTypeDistribution from './AttackTypeDistribution';
import initFlys, { removeFly } from './fly/index';
import { useIntl } from 'umi';
import config from 'config';
import { useWindowUnloadStatus } from '@/utils/hooks';

const Index = () => {
    const chartInCardHeight = 240;
    const intl = useIntl();
    const [filter, setFilter] = useState({ dayType: 4 });
    useWindowUnloadStatus(removeFly);
    useEffect(() => {
        if (filter.vehicleModleId) {
            initFlys();
        }
    }, [filter]);
    return (
        <div className={styles.container}>
            <Header filter={filter} intervalTime={config.chartRefreshInterval} />
            <Filter value={filter} onChange={setFilter} />
            {filter.vehicleModleId && (
                <>
                    <div className={styles.content}>
                        <Row type={'flex'} gutter={12}>
                            <Col span={3}>
                                <VehicleDistribution height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                            </Col>
                            <Col span={3}>
                                <EventDistribution height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                            </Col>
                            <Col span={12} />
                            <Col span={6}>
                                <SparePartsTrend height={chartInCardHeight} filter={filter} intervalTime={config.chartRefreshInterval} />
                            </Col>
                        </Row>
                        <div className={styles.row}>
                            <Tabs type={'card'} className={styles.tabs}>
                                <Tabs.TabPane key={1} tab={intl.formatMessage({ id: 'overview.threatLevel' })}>
                                    <ThreatLevelDistribution height={180} filter={filter} intervalTime={config.chartRefreshInterval} />
                                </Tabs.TabPane>
                                <Tabs.TabPane key={2} tab={intl.formatMessage({ id: 'overview.attackType' })}>
                                    <AttackTypeDistribution height={180} filter={filter} intervalTime={config.chartRefreshInterval} />
                                </Tabs.TabPane>
                            </Tabs>
                        </div>
                        <div className={styles.row}>
                            <AttackTable filter={filter} intervalTime={config.listRefreshInterval} />
                        </div>
                    </div>
                    <ThreatLevelAll filter={filter} intervalTime={config.chartRefreshInterval} />
                    <div id="fly" className={styles.flybox} />
                </>
            )}
        </div>
    );
};

export default Index;
