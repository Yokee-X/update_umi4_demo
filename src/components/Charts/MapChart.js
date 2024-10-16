import React, { useEffect, useMemo } from 'react';
import { LayerEvent, LineLayer, MapboxScene, PointLayer, PolygonLayer, Popup } from '@antv/l7-react';
import { getRangeColor } from '@/utils';
import config from 'config';
import styles from './MapChart.less';
import { isCn } from '@/locales';
const MapChart = ({ height, data, placeholder, onEnterArea, flydata, showHint = true }) => {
    const [popupInfo, setPopupInfo] = React.useState();
    const sceneRef = React.useRef();

    const labelData = useMemo(() => {
        return data?.features.map(fea => {
            const item = {
                ...fea.properties,
                nameWidthValue: isCn ? fea.properties.name : fea.properties.en_name,
                center: fea.properties.centroid
            };
            if (fea.properties.value > 0) {
                item.nameWidthValue += `(${fea.properties.value})`;
            }
            return item;
        });
    }, [data]);

    useEffect(() => {
        if (data && sceneRef.current) {
            const scopeZoomMap = {
                world: 0.77,
                china: 4.0
            };
            const scopeCenterMap = {
                world: [0, 45],
                china: [107, 38]
            };
            const zoom = scopeZoomMap[data.scope];
            const center = scopeCenterMap[data.scope];
            if (null != zoom) {
                sceneRef.current.setZoom(zoom);
                sceneRef.current.setCenter(center);
            }
            if (data.scope === 'china') {
                sceneRef.current.setZoom(3.3);
            }
        }
    }, [data]);
    useEffect(() => {
        if (flydata && sceneRef.current) {
            sceneRef.current.setPitch(40);
            if (!sceneRef.current.hasImage('plane')) {
                sceneRef.current.addImage('plane', require('@/assets/geo/attack.svg'));
            }
        }
    }, [flydata]);
    function showPopup(args) {
        if (!args.feature.properties.id) {
            hidePopup();
            return;
        }
        setPopupInfo({
            lnglat: { lng: args.feature.properties.centroid[0], lat: args.feature.properties.centroid[1] },
            feature: args.feature
        });
    }

    function hidePopup() {
        setPopupInfo(null);
    }

    function handleClick(args) {
        onEnterArea?.(args.feature.properties);
    }
    return (
        <>
            <MapboxScene
                map={{
                    pitch: 0,
                    style: 'blank'
                }}
                style={{ height }}
                className={styles.container}
                onSceneLoaded={s => (sceneRef.current = s)}
            >
                {data && [
                    <PolygonLayer
                        key={'polygon'}
                        options={{
                            autoFit: true
                        }}
                        source={{
                            data
                        }}
                        active={{
                            option: {
                                // color: '#333',
                            }
                        }}
                        color={{
                            field: ['id', 'value'], // 填充颜色
                            values: (stateCode, value = 0) => {
                                if (!stateCode) return config.areaChartColors['0'];
                                return getRangeColor(config.areaChartColors, value);
                            }
                        }}
                        shape={{
                            values: 'fill'
                        }}
                        style={{
                            opacity: 1
                        }}
                    >
                        {showHint && <LayerEvent type="mousemove" handler={showPopup} />}
                        {showHint && <LayerEvent type="mouseout" handler={hidePopup} />}
                        <LayerEvent type="click" handler={handleClick} />
                    </PolygonLayer>,
                    <LineLayer
                        key={'line'}
                        source={{
                            data
                        }}
                        size={{
                            values: 0.3
                        }}
                        color={{
                            values: '#5084ea' // 描边颜色
                        }}
                        shape={{
                            values: 'line'
                        }}
                        style={{
                            opacity: 1
                        }}
                    />
                ]}
                {/* 飞线 */}
                {flydata && [
                    <LineLayer
                        key={'plane'}
                        source={{
                            data: flydata,
                            parser: {
                                type: 'json',
                                coordinates: 'coord'
                            }
                        }}
                        size={{
                            values: 30 //飞机宽度
                        }}
                        // color={{
                        //     values: 'rgb(22,119,255)', // 描边颜色
                        // }}
                        shape={{
                            values: 'arc3d'
                        }}
                        style={{
                            opacity: 1,
                            texture: 'plane', //设置纹理
                            lineTexture: true, // 开启线的贴图功能
                            textureBlend: 'replace',
                            iconStep: 13 // 设置贴图纹理的间距(飞机长度)
                        }}
                        options={{
                            blend: 'additive', //设置重叠
                            zIndex: 2
                        }}
                        animate={{
                            duration: 1, //动画时间 单位(s)秒
                            interval: 0.5, //轨迹间隔, 取值区间 0 - 1
                            trailLength: 0.05 //轨迹长度 取值区间 0 - 1
                        }}
                    />,
                    <LineLayer
                        key={'flyline'}
                        source={{
                            data: flydata,
                            parser: {
                                type: 'json',
                                coordinates: 'coord'
                            }
                        }}
                        size={{
                            values: 1
                        }}
                        color={{
                            values: 'rgb(22,119,255)' // 描边颜色
                        }}
                        shape={{
                            values: 'arc3d'
                        }}
                        style={{
                            opacity: 1
                            // sourceColor: '#f00', //设置渐变线
                            // targetColor: '#6F19FF'
                        }}
                        options={
                            {
                                // zIndex: 2,
                            }
                        }
                    />,
                    <PointLayer
                        key={'attackPoint'}
                        source={{
                            data: flydata,
                            parser: {
                                type: 'json',
                                x: 'x',
                                y: 'y'
                            }
                        }}
                        options={{
                            blend: 'additive' //设置重叠
                        }}
                        color={{
                            values: 'rgb(22,119,255)' // 描边颜色
                        }}
                        animate={true}
                        shape={{
                            values: 'circle'
                        }}
                        size={{
                            values: 40
                        }}
                        style={{
                            opacity: 1
                        }}
                    />
                ]}
                {labelData && (
                    <PointLayer
                        key={'label'}
                        size={{
                            values: 12
                        }}
                        source={{
                            data: labelData,
                            parser: {
                                type: 'json',
                                coordinates: 'center'
                            }
                        }}
                        shape={{
                            field: 'nameWidthValue',
                            values: 'text'
                        }}
                    />
                )}

                {popupInfo && (
                    <Popup lnglat={popupInfo.lnglat} option={{ offsets: [0, 12], closeButton: false }}>
                        <div className={styles.tooltip}>
                            {isCn ? popupInfo.feature.properties.name : popupInfo.feature.properties.en_name} : {popupInfo.feature.properties.value || 0}
                        </div>
                    </Popup>
                )}
                {showHint && data?.scope == 'china' && <img src={require('@/assets/img/nansha.png')} className={styles.img} />}
                {showHint && (
                    <div className={styles.leftcontent}>
                        {Object.keys(config.areaChartColors).map((key, index) => {
                            let name = '';
                            if (index == Object.keys(config.areaChartColors).length - 1) {
                                name = key.split('-')[0] + '及以上';
                            }
                            return (
                                <div className={styles.leftItem} key={index}>
                                    <div className={styles.color} style={{ backgroundColor: config.areaChartColors[key] }} />
                                    <span className={styles.title}>{name || key}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </MapboxScene>
        </>
    );
};

export default MapChart;
