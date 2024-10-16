import { Col, Row } from 'antd';
import styles from './style.less';
import Header from './Header';
import Brand from './Brand';
import ModelTop from './ModelTop';
import SparePartsTop from './SparePartsTop';
import ThreatLevel from './ThreatLevel';
import TypeTop from './TypeTop';
import DataTable from './DataTable';
import StatusScatter from './StatusScatter';
import config from 'config';

const Index = () => {
    const chartInCardHeight = 300;
    const chartInDownCardHeight = 500;
    return (
        <div className={styles.container}>
            <Header intervalTime={config.chartRefreshInterval} />
            <div className={styles.content}>
                <Row type={'flex'} gutter={[20, 20]}>
                    <Col span={6}>
                        <Brand height={chartInCardHeight} intervalTime={config.chartRefreshInterval} />
                    </Col>
                    <Col span={6}>
                        <ModelTop height={chartInCardHeight} intervalTime={config.chartRefreshInterval} />
                    </Col>
                    <Col span={6}>
                        <ThreatLevel height={chartInCardHeight} intervalTime={config.chartRefreshInterval} />
                    </Col>
                    <Col span={6}>
                        <StatusScatter height={chartInCardHeight} intervalTime={config.chartRefreshInterval} />
                    </Col>
                    <Col span={6}>
                        <TypeTop height={chartInDownCardHeight} intervalTime={config.chartRefreshInterval} />
                    </Col>
                    <Col span={12}>
                        <DataTable intervalTime={config.listRefreshInterval} />
                    </Col>
                    <Col span={6}>
                        <SparePartsTop height={chartInDownCardHeight} intervalTime={config.chartRefreshInterval} />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Index;
