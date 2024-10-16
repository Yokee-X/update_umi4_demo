import React from 'react';
import { Axis, Chart, LineAdvance, Tooltip } from 'bizcharts';

const TrendChart = ({ data, height, placeholder, valueAlias, appendPadding = [10, 10, 10, 10] }) => {
    return (
        <Chart scale={{ value: { min: 0, alias: valueAlias }, label: { type: 'time', nice: false } }} padding={'auto'} appendPadding={appendPadding} autoFit height={height} data={data} placeholder={placeholder} animate={false}>
            <LineAdvance shape="smooth" position="label*value" area color="#81F6A9" />
        </Chart>
    );
};

export default TrendChart;
