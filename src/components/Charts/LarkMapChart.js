import React, { useEffect, useMemo } from 'react';
import { getRangeColor } from '@/utils';
import config from 'config';
import styles from './MapChart.less';
import { isCn } from '@/locales';
import { LarkMap, PolygonLayer, LineLayer, PointLayer, Popup, TextLayer, CustomControl, LegendCategories } from '@antv/larkmap';
const LarkMapChart = ({ height, data, placeholder, onEnterArea, flydata, showHint = true }) => {
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
        if (data && sceneRef.current?.getScene()) {
            const scene = sceneRef.current?.getScene();
            const scopeZoomMap = {
                world: 0.77,
                china: 4
            };
            const scopeCenterMap = {
                world: [0, 45],
                china: [107, 40]
            };
            const zoom = scopeZoomMap[data.scope];
            const center = scopeCenterMap[data.scope];
            if (null != zoom) {
                scene.setZoom(zoom);
                scene.setCenter(center);
            }
            if (data.scope === 'china') {
                scene.setZoom(3.3);
            }
        }
    }, [data]);
    useEffect(() => {
        if (flydata?.length && sceneRef.current?.getScene()) {
            let scene = sceneRef.current?.getScene();
            scene.setPitch(40);
            if (!scene.hasImage('plane')) {
                scene.addImage('plane', require('@/assets/geo/attack.svg'));
            }
        }
    }, [flydata]);
    function showPopup(args) {
        if (!showHint) return;
        if (!args.feature.properties.id) {
            hidePopup();
            return;
        }
        setPopupInfo({
            lnglat: args.lngLat,
            // lnglat: { lng: args.feature.properties.centroid[0], lat: args.feature.properties.centroid[1] },
            feature: args.feature
        });
    }

    function hidePopup() {
        if (!showHint) return;
        setPopupInfo(null);
    }

    function handleClick(args) {
        hidePopup();
        onEnterArea?.(args.feature.properties);
    }

    return (
        <LarkMap
            logoVisible={false}
            className={styles.container}
            ref={sceneRef}
            onSceneLoaded={scene => {}}
            style={{ height }}
            // mapType={'Gaode'} mapOptions={{style:"dark"}}
            mapType={'Map'}
        >
            {data && [
                <PolygonLayer
                    key={'polygon'}
                    autoFit
                    source={{
                        data,
                        parser: { type: 'geojson', coordinates: 'coordinates' }
                    }}
                    color={{
                        field: 'value', // 填充颜色
                        value: ({ value }) => {
                            if (!value) return config.areaChartColors['0'];
                            return getRangeColor(config.areaChartColors, value);
                        }
                    }}
                    state={{ active: true }}
                    shape={'fill'}
                    style={{
                        opacity: 1
                    }}
                    onClick={handleClick}
                    onMouseMove={showPopup}
                    onMouseOut={hidePopup}
                ></PolygonLayer>,
                <LineLayer
                    key={'line'}
                    source={{
                        data,
                        parser: { type: 'geojson', coordinates: 'coordinates' }
                    }}
                    size={0.3}
                    color={'#5084ea'}
                    shape={'line'}
                    style={{
                        opacity: 1
                    }}
                />
            ]}
            {labelData && (
                <TextLayer
                    key={'label'}
                    source={{
                        data: labelData,
                        parser: {
                            type: 'json',
                            coordinates: 'center'
                        }
                    }}
                    field={'nameWidthValue'}
                    autoFit
                    style={{
                        fontSize: 12
                    }}
                />
            )}
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
                    size={
                        30 //飞机宽度
                    }
                    shape={'arc3d'}
                    style={{
                        opacity: 1,
                        texture: 'plane', //设置纹理
                        lineTexture: true, // 开启线的贴图功能
                        textureBlend: 'replace',
                        iconStep: 13 // 设置贴图纹理的间距(飞机长度)
                    }}
                    blend="additive" //设置重叠
                    zIndex={2}
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
                    size={1}
                    color={
                        'rgb(22,119,255)' // 描边颜色
                    }
                    shape={'arc3d'}
                    style={{
                        opacity: 1
                        // sourceColor: '#f00', //设置渐变线
                        // targetColor: '#6F19FF'
                    }}
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
                    blend={
                        'additive' //设置重叠
                    }
                    color={
                        'rgb(22,119,255)' // 描边颜色
                    }
                    animate={true}
                    shape={'circle'}
                    size={30}
                    style={{
                        opacity: 1
                    }}
                />
            ]}
            {popupInfo && (
                <Popup lngLat={popupInfo.lnglat} offsets={[0, 12]} closeButton={false}>
                    <div className={styles.tooltip}>
                        {isCn ? popupInfo.feature.properties.name : popupInfo.feature.properties.en_name} : {popupInfo.feature.properties.value || 0}
                    </div>
                </Popup>
            )}
            {showHint && data?.scope == 'china' && <img src={require('@/assets/img/nansha.png')} className={styles.img} />}
            {showHint && (
                <CustomControl position={'bottomleft'}>
                    <LegendCategories
                        // geometryType="square"
                        labels={Object.keys(config.areaChartColors).map((key, index) => {
                            let name = key;
                            if (index == Object.keys(config.areaChartColors).length - 1) {
                                name = key.split('-')[0] + '及以上';
                            }
                            return name;
                        })}
                        colors={Object.values(config.areaChartColors)}
                        style={{ transform: 'scale(0.9)', color: '#fff', fontWeight: 500 }}
                    />
                </CustomControl>
            )}
        </LarkMap>
    );
};

export default LarkMapChart;
