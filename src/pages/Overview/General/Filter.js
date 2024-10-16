import { Select } from 'antd';
import styles from './style.less';
import { FilterDayTypes } from './service';

const Filter = ({ value, onChange }) => {
  return (
    <div className={styles.filterForm}>
      <Select
        className={styles.select}
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

export default Filter;
