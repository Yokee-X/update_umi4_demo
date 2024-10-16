export default [
    {
        path: '/exception',
        routes: [
            { path: '/exception/404', component: './Exception/404' },
            { path: '/exception/403', component: './Exception/403' },
            { path: '/exception/500', component: './Exception/500' }
        ]
    },
    {
        path: '/overview',
        component: '../layouts/OverviewLayout',
        wrappers: ['@/router-interceptor/authorized/Logged', '@/router-interceptor/authorized/Authed'],
        routes: [
            {
                path: 'general',
                component: './Overview/General',
                title: '总体态势'
            },
            {
                path: 'vulnes',
                component: './Overview/Vulnes',
                title: '漏洞态势'
            },
            {
                path: 'risks',
                component: './Overview/Risks',
                title: '风险态势'
            },
            {
                path: 'brands',
                component: './Overview/Brands',
                title: '品牌态势'
            },
            {
                path: 'vmodels',
                component: './Overview/Vmodels',
                title: '车型态势'
            }
        ]
    },
];
