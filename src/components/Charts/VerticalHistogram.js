import React, { useMemo } from 'react';
import { Axis, Chart, Coordinate, Interval, Legend, Tooltip } from 'bizcharts';
import numeral from 'numeral';

const VerticalHistogram = ({ height, data, placeholder, color = VerticalHistogram.Colors.GradientBlue, onClick }) => {
    const chartData = useMemo(() => data?.reverse() || [], [data]);
    return (
        <Chart
            height={height}
            data={chartData}
            autoFit
            animate={false}
            padding={[20, 12, 12, 0]}
            placeholder={placeholder}
            onClick={evt => onClick?.(evt)}
            onMouseMove={e => {
                if (onClick) {
                    if (e.gEvent.shape && e.gEvent.shape.attrs) {
                        e.gEvent.shape.attrs.cursor = 'pointer';
                    }
                }
            }}
        >
            <Tooltip showTitle={false} />
            <Interval
                position="label*value"
                shape={[
                    'label*value',
                    (date, val) => {
                        if (val === 0) {
                            return;
                        }
                        return 'border-radius-vertical';
                    }
                ]}
                label={[
                    'label*value',
                    (label, value) => ({
                        position: 'left', // top|middle|bottom|left|right
                        offsetX: -4,
                        offsetY: -16,
                        content: (label.length > 10 ? label.substring(0, 10) + '...' : label) + '：' + numeral(value).format('0,0'),
                        style: {
                            fill: '#fff'
                        }
                    })
                ]}
                color={color}
                size={12}
                // style={onClick && {cursor:'pointer'}}
            />
            <Coordinate transpose />
            <Axis name="label" visible={false} />
            <Axis name="value" visible={false} />
            <Legend visible={false} />
        </Chart>
    );
};

VerticalHistogram.Colors = {
    GradientBlue: 'l(0) 0:#1890ff 1:#70cdd0',
    GradientOrange: 'l(0) 0:#f09435 1:#de9b63'
};

export default VerticalHistogram;
