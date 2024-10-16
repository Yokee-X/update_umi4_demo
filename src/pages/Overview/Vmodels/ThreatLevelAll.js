import { useEffect } from 'react';
import { useRequest } from 'umi';
import { getThreatLevelDistribution } from './service';
import styles from './style.less';
const EventDistribution = ({ filter, intervalTime }) => {
    const { run, data, loading, error } = useRequest(getThreatLevelDistribution, {
        manual: true,
        pollingInterval: intervalTime,
        formatResult: result => {
            let map = new Map();
            result.forEach(item => {
                let obj = {};
                obj.name = item.name;
                if (item.data.length == 0) {
                    obj.total = 0;
                } else {
                    let total = 0;
                    for (let j in item.data) {
                        let dataItem = item.data[j];
                        total += dataItem.value;
                    }
                    obj.total = total;
                }
                let name = obj.name.split('-')[0];
                if (!map.has(name)) {
                    map.set(name, [obj]);
                } else {
                    map.get(name).push(obj);
                }
            });
            console.log(map, 'map---map');
            const arr = [];
            for (let [k, v] of map) {
                arr.push(v);
            }
            return arr;
        },
        onSuccess: v => console.log(v, 'vvvvvvvv')
    });
    useEffect(() => {
        run(filter);
    }, [filter]);
    let boxStyle = [
        {
            top: '220px',
            left: '-32px'
        },
        {
            top: '104px',
            left: '-20px',
            justifyContent: 'flex-end'
        },
        {
            top: '305px',
            left: '85px',
            justifyContent: 'flex-start'
        },
        {
            top: '255px',
            left: '270px'
        },
        {
            top: '64px',
            left: '246px',
            justifyContent: 'flex-start'
        },
        {
            top: '137px',
            left: '430px',
            justifyContent: 'flex-start'
        },
        {
            top: '80px',
            left: '625px'
        }
    ];

    return (
        <div className={styles.flycontent}>
            {data?.map((item, index) => {
                if (index > boxStyle.length - 1) return;
                return (
                    <div className={styles.flyitem} style={{ ...boxStyle[index] }}>
                        {item.map(v => (
                            <p>
                                {v.name}：{v.data}
                            </p>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default EventDistribution;
