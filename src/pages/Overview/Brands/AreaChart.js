import LarkMapChart from '@/components/Charts/LarkMapChart';
import intl from '@/locales';
import { getCity } from '@/services/basic';
import { useGeoViewData } from '@/utils/hooks';
import { GlobalOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import config from 'config';
import { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { getAttackedCountryTop } from './service';
import styles from './style.less';
function AreaChart({ filter, onChange, eventData, intervalTime }) {
    const [areaScope, setAreaScope] = useState(config.defaultScope);
    const [flydata, setFlydata] = useState(null);
    const {
        run: fetchData,
        data,
        error,
        loading
    } = useRequest(getAttackedCountryTop, {
        manual: true,
        pollingInterval: intervalTime,
        onError: err => message.error(err.message)
    });
    const viewData = useGeoViewData(areaScope, data);
    const { run, data: cityData } = useRequest(getCity, {
        manual: true,
        onSuccess: data => {
            if (filter.countryType == 1) {
                sessionStorage.setItem('world', JSON.stringify(data));
            }
            if (filter.countryType == 2) {
                sessionStorage.setItem('china', JSON.stringify(data));
            }
        }
    });
    useEffect(() => {
        fetchData(filter);
    }, [filter]);
    useEffect(() => {
        let china = sessionStorage.getItem('china');
        let world = sessionStorage.getItem('world');
        if ((filter.countryType == 1 && !world) || (filter.countryType == 2 && !china)) {
            run({ countryType: filter.countryType });
        }
    }, [filter.countryType]);
    //处理飞线数据
    useEffect(() => {
        if (filter.countryType == 1) {
            //国外
            let world = JSON.parse(sessionStorage.getItem('world'));
            if (world && eventData) {
                let res = [],
                    arr = [];
                console.log(1);
                for (let i in eventData) {
                    if (eventData[i].citySrc == eventData[i].city) continue;
                    eventData[i].attack = [eventData[i].stateSrc, eventData[i].provinceSrc, eventData[i].citySrc].filter(v => !!v).join(',');
                    eventData[i].dest = [eventData[i].state, eventData[i].province, eventData[i].city].filter(v => !!v).join(',');
                    if (eventData[i].attack && eventData[i].dest) {
                        if (eventData[i].attack.includes('中国')) {
                            eventData[i].attack = '中国,北京市';
                        }
                        if (eventData[i].dest.includes('中国')) {
                            eventData[i].dest = '中国,北京市';
                        }
                        if (eventData[i].attack != eventData[i].dest) {
                            arr.push(eventData[i]);
                        }
                    }
                }
                console.log(arr, 'arr');
                for (let i in arr) {
                    let lat1, lat2;
                    for (let j in world) {
                        if (arr[i].attack.includes(world[j].fullName)) {
                            lat1 = [world[j].longitude * 1, world[j].latitude * 1];
                        }
                        if (arr[i].dest.includes(world[j].fullName)) {
                            lat2 = [world[j].longitude * 1, world[j].latitude * 1];
                        }
                    }
                    if (lat1 && lat2) {
                        let obj = {
                            coord: [lat1, lat2],
                            x: lat2[0],
                            y: lat2[1]
                        };
                        res.push(obj);
                    }
                }
                console.log(flydata, 'res');
                setFlydata(res);
            }
        } else {
            //国内
            let china = JSON.parse(sessionStorage.getItem('china'));
            if (eventData && china) {
                let res = [],
                    arr = [];
                for (let i in eventData) {
                    if (eventData[i].citySrc == eventData[i].city) continue;
                    eventData[i].attack = [eventData[i].stateSrc, eventData[i].provinceSrc, eventData[i].citySrc].filter(v => !!v).join(',');
                    eventData[i].dest = [eventData[i].state, eventData[i].province, eventData[i].city].filter(v => !!v).join(',');
                    if (eventData[i].attack && eventData[i].dest && eventData[i].attack != eventData[i].dest) {
                        arr.push(eventData[i]);
                    }
                }
                for (let i in arr) {
                    let lat1, lat2;
                    for (let j in china) {
                        if (arr[i].attack.includes(china[j].fullName)) {
                            lat1 = [china[j].longitude * 1, china[j].latitude * 1];
                        }
                        if (arr[i].dest.includes(china[j].fullName)) {
                            lat2 = [china[j].longitude * 1, china[j].latitude * 1];
                        }
                    }
                    if (lat1 && lat2) {
                        let obj = {
                            coord: [lat1, lat2],
                            x: lat2[0],
                            y: lat2[1]
                        };
                        res.push(obj);
                    }
                }
                console.log(flydata, 'res');
                setFlydata(res);
            }
        }
    }, [eventData, cityData, filter.countryType]);
    const onEnterArea = props => {
        if (areaScope !== 'world') return;
        const code = { CHN: 'china' }[props.id];
        if (!code) {
            console.error(`${code} is not found`);
            return;
        }
        onChange({ ...filter, countryType: 2 });
        setAreaScope(code);
    };
    return (
        <Spin spinning={loading} style={{ width: '100%' }}>
            {areaScope !== 'world' && (
                <a
                    onClick={() => {
                        setAreaScope('world');
                        onChange({ ...filter, countryType: 1 });
                    }}
                    title={intl.formatMessage({ id: 'overview.icon' })}
                    className={styles.globalIcon}
                >
                    <GlobalOutlined />
                </a>
            )}
            <LarkMapChart height={640} flydata={flydata} data={viewData} placeholder={error?.message} onEnterArea={onEnterArea} />
        </Spin>
    );
}

export default AreaChart;
