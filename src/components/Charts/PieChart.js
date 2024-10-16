import React from 'react';
import { Axis, Chart, Coordinate, Interval, Legend, Tooltip } from 'bizcharts';

const PieChart = ({ height, data, placeholder, color = 'label', appendPadding = 10, legend = false, label }) => {
    return (
        <Chart height={height} data={data} padding={'auto'} appendPadding={appendPadding} animate={false} placeholder={placeholder} autoFit>
            <Coordinate type="theta" radius={0.75} />
            <Axis visible={false} />
            <Legend visible={legend} />
            <Tooltip showTitle={false} />
            <Interval
                position="value"
                adjust="stack"
                color={color}
                label={
                    label
                        ? label
                        : [
                              'label*value',
                              {
                                  content: data => {
                                      return `${data.label}: ${data.value}`;
                                  }
                              }
                          ]
                }
            />
        </Chart>
    );
};

export default PieChart;
