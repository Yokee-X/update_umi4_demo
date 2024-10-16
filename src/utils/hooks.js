import { useCallback, useEffect, useRef, useState } from 'react';

export function useGeoViewData(name, sourceData) {
    const [viewData, setViewData] = useState();
    const GeoJson = useRef();

    const createViewData = () => {
        const d = GeoJson.current;
        const features = d.features.map(v => {
            const valueData = (sourceData || []).find(n => n.id == v.properties.id);
            const item = { ...v, properties: { ...v.properties, value: 0 } };
            if (valueData) {
                item.properties = {
                    ...item.properties,
                    ...valueData
                };
            }
            return item;
        });
        setViewData({ ...d, features, scope: name });
    };

    useEffect(() => {
        console.log(name);
        import(`@/assets/geo/${name}.json`).then(json => {
            console.log(json);
            GeoJson.current = json;
            createViewData();
        });
    }, [name]);

    useEffect(() => {
        if (GeoJson.current) {
            createViewData();
        }
    }, [sourceData]);

    return viewData;
}

export function useOnceRequestLoading(loading) {
    const visibleCount = useRef(0);
    const [proxy, setProxy] = useState(loading);

    useEffect(() => {
        if (loading) {
            if (visibleCount.current >= 1) return;
            visibleCount.current++;
        }
        setProxy(loading);
    }, [loading]);

    return proxy;
}

export function useWindowUnloadStatus(cb) {
    const flag = useRef(false);
    const handler = () => {
        flag.current = true;
        if (cb) cb();
    };
    useEffect(() => {
        window.addEventListener('beforeunload', handler);
        return () => {
            if (cb) handler();
            window.removeEventListener('beforeunload', handler);
        };
    }, []);
    return flag.current;
}
/*
 * @Description: 同步hooks
 */

export const useSyncCallback = callback => {
    const [proxyState, setProxyState] = useState({ current: false });
    const argsRef = useRef();
    const Func = useCallback(
        (...args) => {
            setProxyState({ current: true });
            argsRef.current = args;
        },
        [proxyState]
    );

    useEffect(() => {
        if (proxyState.current === true) setProxyState({ current: false });
    }, [proxyState]);

    useEffect(() => {
        proxyState.current && callback(...argsRef.current);
        argsRef.current = undefined;
    });
    return Func;
};
