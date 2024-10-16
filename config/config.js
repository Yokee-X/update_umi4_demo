// https://umijs.org/config/
import { defineConfig } from 'umi';
import webpackplugin from './plugin.config';
import pageRoutes from './router.config';

const APP_METADATA = getGlobalParams();
global['APP_METADATA'] = APP_METADATA;
// const { winPath } = utils;

export default defineConfig({
    proxy: {
        '/api': {
            target: 'https://172.16.5.218:850', //内网
            // target: 'https://172.16.5.240:850', //内网
            // target: 'http://172.16.42.172:1072', //本地
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
            logLevel: 'debug',
            secure: false
        }
    },
    // 配置具体含义见：https://github.com/umijs/umi-webpack-bundle-analyzer#options-for-plugin
    analyze: {
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true,
        // generate stats file while ANALYZE_DUMP exist
        generateStatsFile: false,
        statsFilename: 'stats.json',
        logLevel: 'info',
        defaultSizes: 'parsed' // stat  // gzip
    },
    devtool: false,
    devtool: APP_METADATA.env === 'development' ? 'eval-source-map' : undefined,
    // add for transfer to umi
    legacy: {
        nodeModulesTransform: false
    },
    request: {},
    mock: false,
    antd: {
        configProvider: {}
    },
    dva: {},
    model: {},
    locale: {
        default: 'zh-CN', // default zh-CN
        antd: true,
        baseNavigator: false // default true, when it is true, will use `navigator.language` overwrite default
    },
    // dynamicImport: {
    //     loading: '@/components/PageLoading/index'
    // },
    define: {
        APP_TYPE: process.env.APP_TYPE || '',
        APP_METADATA
    },
    mfsu: false,
    chainWebpack: webpackplugin,

    // mako:{

    // },
    targets: { ie: 11 },
    fastRefresh: true,
    // 路由配置
    routes: pageRoutes,
    history: { type: 'browser' },
    // history: 'hash',
    hash: true,
    base: APP_METADATA.baseUrl,
    publicPath: APP_METADATA.baseUrl,
    // runtimePublicPath: {},
    // Theme for antd
    // https://ant.design/docs/react/customize-theme-cn
    // theme: defaultSettings.customTheme,
    // externals: {
    //     '@antv/data-set': 'DataSet',
    // },
    title: false,
    ignoreMomentLocale: false,
    lessLoader: {
        javascriptEnabled: true,
        globalVars: {
            theme: 'true;@import "~antd/lib/style/themes/variable.less"'
        }
    },
    reactRouter5Compat: {}
    // chainWebpack: webpackplugin
    // chunks: ['react', 'antdVendor', 'umi', 'common'],
    // cssnano: {
    //     preset: 'default'
    //     // mergeRules: false,
    // }
});

function getGlobalParams() {
    const BUILD_ENV = process.env.BUILD_ENV || process.env.NODE_ENV;
    const startParams = process.argv
        .slice(2)
        .map(arg => arg.split('='))
        .reduce((args, [value, key]) => {
            if (/^--/.test(value)) {
                args[value.replace(/^--/, '')] = key;
            }
            return args;
        }, {});
    const PUBLIC_PATH = startParams.basePath || '/';
    console.log('Base Path', PUBLIC_PATH);
    console.log('buildVersion', startParams['bv']);
    return {
        env: BUILD_ENV,
        baseUrl: PUBLIC_PATH,
        buildVersion: startParams['bv'],
        StartParams: startParams
    };
}
