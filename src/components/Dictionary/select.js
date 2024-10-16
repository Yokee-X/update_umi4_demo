import React from 'react';
import useDictionary from './hook';
import { Select } from 'antd';

const DictionarySelect = React.forwardRef((props, ref) => {
    const { labelKey = 'label', valueKey = 'value', type, onData, params = { pageSize: 999 }, value, ...rest } = props;
    const { data, loading } = useDictionary({ type, ...params });
    React.useEffect(() => {
        if (!loading) {
            onData && onData(data?.list);
        }
    }, [loading]);
    return (
        <Select {...rest} value={loading ? undefined : value} loading={loading}>
            {data?.list?.map(item => (
                <Select.Option key={item[valueKey]} value={item[valueKey]} source={item}>
                    {item[labelKey]}
                </Select.Option>
            ))}
        </Select>
    );
});

export default DictionarySelect;
