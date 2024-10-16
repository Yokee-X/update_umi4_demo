import { Switch } from 'antd';

export default function NumberSwitch({ onChange, value, ...restProps }) {
    function handleSwitchChange(value) {
        if (onChange) {
            onChange(value ? 1 : 0);
        }
    }

    return <Switch {...restProps} checked={!!value} onChange={value => handleSwitchChange(value)}></Switch>;
}
