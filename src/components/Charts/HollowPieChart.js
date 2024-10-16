import React from 'react';
import { Axis, Chart, Coordinate, Interval, Tooltip, Annotation, Legend } from 'bizcharts';

const HollowPieChart = ({ height, data, placeholder, innerText, appendPadding = 10, legend = false, toolTipDomStyles = { 'g2-tooltip-value': { float: 'none', marginLeft: 0 } }, color = 'label', onClick, label }) => {
    return (
        <Chart height={height} data={data} padding={'auto'} animate={false} appendPadding={appendPadding} placeholder={placeholder} autoFit onClick={evt => onClick?.(evt)}>
            <Coordinate type="theta" radius={0.75} innerRadius={0.75} />
            <Axis visible={false} />
            <Legend visible={legend} />
            <Tooltip visible={true} showTitle={false} domStyles={toolTipDomStyles} />
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
                                  // label 太长自动截断
                                  // layout:{ type: 'limit-in-plot'},
                                  layout: { type: 'pie-spider', cfg: { action: 'ellipsis' } }
                                  // content: (data) => {
                                  //     let res = (limitLabel&&`${data.label}: ${data.value}`.length>limitLabel)?`${data.label}: ${data.value}`.substring(0,limitLabel)+'...':`${data.label}: ${data.value}`;
                                  //     return res;
                                  // },
                              }
                          ]
                }
                style={onClick && { cursor: 'pointer' }}
            />
            {innerText && (
                <Annotation.Text
                    position={['50%', '50%']}
                    content={innerText}
                    style={{
                        lineHeight: '240px',
                        fontSize: '17',
                        fill: '#fff',
                        textAlign: 'center'
                    }}
                />
            )}
        </Chart>
    );
};

export default HollowPieChart;
