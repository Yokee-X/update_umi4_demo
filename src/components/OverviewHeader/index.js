import { Col, Row, Statistic } from 'antd';
import styles from './style.less';

const OverviewHeader = ({ title, statistic }) => {
  const renderStatistic = (list) => {
    if (!list?.length) return null;
    return (
      <Row className={styles.quantity} type={'flex'}>
        {list.map(({ title, value, precision = 0 }) => (
          <Col span={24 / list.length} key={title}>
            <Statistic title={title} value={value} precision={precision} />
          </Col>
        ))}
      </Row>
    );
  };
  return (
    <Row type={'flex'} className={styles.header}>
      <Col className={styles.headerLeft}>{renderStatistic(statistic?.[0])}</Col>
      <Col className={styles.title}>
        <h1>{title}</h1>
      </Col>
      <Col className={styles.headerRight}>
        {renderStatistic(statistic?.[1])}
      </Col>
    </Row>
  );
};

export default OverviewHeader;
