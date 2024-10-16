// Change theme plugin
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
export default config => {
    console.log('>>>>', APP_METADATA.env);
    // init loader
    config.merge({
        optimization: {
            splitChunks: {
                // chunks: 'all',
                cacheGroups: {
                    react: {
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        chunks: 'all',
                        name: 'react',
                        priority: 30
                    },
                    common: {
                        name: 'common',
                        test: /\.(css|less)$/,
                        chunks: 'async',
                        minChunks: 1,
                        minSize: 0,
                        priority: 10,
                        reuseExistingChunk: true
                    },
                    antdVendor: {
                        test: /[\\/]node_modules[\\/](antd)[\\/]/,
                        name: 'antdVendor',
                        priority: 20
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        }
    });

    config.module
        .rule('yml')
        .test(/\.ya?ml$/)
        .use('yaml')
        .loader('yaml-loader');
    config.resolve.alias.set('config', path.resolve(__dirname, '../src/config', APP_METADATA.env));

    config.optimization.minimizer('terser').use(TerserPlugin, [
        {
            terserOptions: {
                compress: {
                    drop_console: true // 移除所有console.log语句
                },
                output: {
                    comments: false // 移除注释
                }
            },
            extractComments: false
        }
    ]);
};
