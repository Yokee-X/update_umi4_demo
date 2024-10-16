import styles from './style.less';
import Header from './Header';
import { Col, Row } from 'antd';
import Brand from './Brand';
import ModelTop from './ModelTop';
import RiskLevelDistribution from './RiskLevelDistribution';
import SpareParts from './SpareParts';
import StatusScatter from './StatusScatter';
import DataTable from './DataTable';
import config from 'config';

const Index = () => {
    const chartInCardHeight = 300;
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
                        <RiskLevelDistribution height={chartInCardHeight} intervalTime={config.chartRefreshInterval} />
                    </Col>
                    <Col span={6}>
                        <StatusScatter height={chartInCardHeight} intervalTime={config.chartRefreshInterval} />
                    </Col>

                    <Col span={18}>
                        <DataTable intervalTime={config.listRefreshInterval} />
                    </Col>
                    <Col span={6}>
                        <SpareParts height={523} intervalTime={config.chartRefreshInterval} />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Index;
