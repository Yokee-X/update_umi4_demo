import { Select } from 'antd';
import styles from './style.less';
import { FilterDayTypes } from './service';
import { CarBrandsSelect } from '@/components/BasicDataSelect';
import { withRouter } from 'umi';

const Filter = ({ value, onChange, location }) => {
  return (
    <div className={styles.filterForm}>
      <CarBrandsSelect
        showAll
        allowClear={false}
        value={value.brandId}
        onChange={(v) => {
          onChange({
            ...value,
            brandId: v,
          });
        }}
        onReady={(data) => {
          if (location.query.brandId) {
            onChange({
              ...value,
              brandId: +location.query.brandId,
            });
          } else if (data?.[0]) {
            onChange({
              ...value,
              brandId: data?.[0].id,
            });
          }
        }}
      />
      <Select
        value={value.dayType}
        onChange={(v) => {
          onChange({
            ...value,
            dayType: v,
          });
        }}
      >
        {FilterDayTypes.map((item) => (
          <Select.Option value={item.value} key={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default withRouter(Filter);
