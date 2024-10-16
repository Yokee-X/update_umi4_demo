import React from 'react';
import { Axis, Chart, Interval, Legend, Tooltip } from 'bizcharts';

const Histogram = ({ height, data, placeholder, color = Histogram.Colors.GradientBlue, axisLabel = {} }) => {
    return (
        <Chart height={height} data={data} autoFit animate={false} padding={[20, 20, 20, 20]} placeholder={placeholder}>
            <Tooltip showTitle={false} />
            <Interval
                position="label*value"
                label={'value'}
                color={color}
                size={12}
                shape={[
                    'label*value',
                    (date, val) => {
                        if (val === 0) {
                            return;
                        }
                        return 'border-radius';
                    }
                ]}
            />
            <Axis name="label" label={axisLabel} />
            <Axis name="value" visible={false} />
            <Legend visible={false} />
        </Chart>
    );
};

Histogram.Colors = {
    GradientBlue: 'l(90) 0:#70cdd0 1:#1890ff',
    GradientOrange: 'l(90) 0:#de9b63 1:#f09435'
};

export default Histogram;
