import { CarModelsSelect } from '@/components/BasicDataSelect';
import { Select } from 'antd';
import { parse } from 'query-string';
import { useLocation } from 'umi';
import { FilterDayTypes } from './service';
import styles from './style.less';

const Filter = ({ value, onChange }) => {
    const location = useLocation();
    let { vehicleModleId } = parse(location.search);
    return (
        <div className={styles.filterForm}>
            <CarModelsSelect
                showAll
                allowClear={false}
                value={value.vehicleModleId}
                onChange={v => {
                    onChange({
                        ...value,
                        vehicleModleId: v
                    });
                }}
                onReady={data => {
                    if (vehicleModleId) {
                        onChange({
                            ...value,
                            vehicleModleId: +vehicleModleId
                        });
                    } else if (data?.[0]) {
                        onChange({
                            ...value,
                            vehicleModleId: data?.[0].id
                        });
                    }
                }}
            />
            <Select
                value={value.dayType}
                onChange={v => {
                    onChange({
                        ...value,
                        dayType: v
                    });
                }}
            >
                {FilterDayTypes.map(item => (
                    <Select.Option value={item.value} key={item.value}>
                        {item.label}
                    </Select.Option>
                ))}
            </Select>
        </div>
    );
};

export default Filter;
