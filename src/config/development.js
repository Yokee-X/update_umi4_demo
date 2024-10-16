export default {
    api: '/SOC/webclient/api',
    // api: '/api',
    platformPath: '', //平台地址
    listRefreshInterval: 1000 * 60 * 5,
    chartRefreshInterval: 1000 * 60 * 10,
    defaultScope: 'china',
    areaChartColors: {
        0: '#313C5D',
        '1-50': '#8FC6EF',
        '51-100': '#3DAAFC',
        '101-200': '#3364FA',
        '201-500': '#4132ED',
        '501-1000': '#401B9B',
        '1001-5000': '#F7B500',
        '5001-10000': '#FA6400',
        '10001-': '#E02020'
    },
    waterMarker: false,
    RuleEnable: {
        ethernet: true, //防火墙+网络入侵
        firewall: true, //防火墙
        network: true, //网络入侵
        canids: true, //canids入侵
        hids: true, //主机入侵
        bids: true, //蓝牙入侵
        tids: true, //流量规则
        idps: true, //idps规则
        canfd: true //can总线配置
    }
};
