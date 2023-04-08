const path = require('path');

const resolve = dir => path.join(__dirname, dir);

//环境判断
const isDev = process.env.VUE_APP_ENV === 'development';
const isSit = process.env.VUE_APP_ENV === 'sit';
const isProd = process.env.VUE_APP_ENV === 'production';

// 资源路径
const isAccess = process.env.VUE_APP_ACCESS_MODE === 'true';

// 非本地环境删除dist文件夹
if (!isDev) {
    const fs = require('fs');
    // 删除文件
    // eslint-disable-next-line no-inner-declarations
    function delDir(path) {
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(file => {
                let curPath = path + '/' + file;
                //判断是否是文件夹
                if (fs.statSync(curPath).isDirectory()) {
                    delDir(curPath); //递归删除文件夹
                } else {
                    //是文件的话说明是最后一层不需要递归
                    fs.unlinkSync(curPath); //删除文件
                }
            });
            fs.rmdirSync(path);
        } else {
            return false;
        }
    }
    // 删除目录
    delDir('./dist');
    delDir('./admin');
}

// 区分测试和生产的打包环境
let publicPath;
let outputDir;
// 测试使用dist打包
if (isSit) {
    publicPath = !isAccess ? process.env.VUE_APP_RESOURCE_URL : './';
    outputDir = 'dist';
}

// 生产使用时间戳
if (isProd) {
    // 前端打包解决缓存问题
    const formatDate = () => {
        const time = new Date();
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let mm = time.getMinutes();
        let ss = time.getSeconds();
        m = m < 10 ? `0${m}` : m;
        d = d < 10 ? `0${d}` : d;
        h = h < 10 ? `0${h}` : h;
        mm = mm < 10 ? `0${mm}` : mm;
        return `${y}${m}${d}${h}${mm}${ss}`;
    };
    const dirName = formatDate();
    publicPath = !isAccess ? `${process.env.VUE_APP_RESOURCE_URL}${dirName}` : './';
    outputDir = `./admin/${dirName}`;
}
module.exports = {
    publicPath,
    lintOnSave: !isProd,
    assetsDir: 'assets',
    productionSourceMap: false,
    indexPath: 'admin.html',
    outputDir,
    devServer: {
        port: 8889, // 端口号
        open: false, // 配置是否自动启动浏览器
        https: false, // 是否启用https
        proxy: {
            //代理
            '/api': {
                target: process.env.VUE_APP_SERVE_URl, // 后台接口域名
                ws: true, //如果要代理 websockets，配置这个参数
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    configureWebpack: {
        // 解决无法引入wangedit
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto'
                }
            ]
        }
    },
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                // 修改它的选项...
                return options;
            });
        // 添加别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('static', resolve('src/static'));
        // 本地mock配置
        config.plugin('define').tap(args => {
            if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_MOCK_ENABLED === 'false') {
                // 开发环境下如果不使用mock，就改为使用代理
                args[0]['process.env'].VUE_APP_BASE_URL = '"/api/"';
                console.log('当前使用本地代理');
            }
            return args;
        });
        if (process.env.NODE_ENV !== 'development') {
            // 删除预加载
            config.plugins.delete('preload');
            config.plugins.delete('prefetch');
            // 压缩代码
            // config.optimization.minimize(true);
            // 分割代码
            config.optimization.splitChunks({
                chunks: 'all'
            });
        }
        // 内敛文件大小设置成100kb
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 10240 }));
    },
    css: {
        sourceMap: process.env.NODE_ENV !== 'production',
        loaderOptions: {
            less: {}
        }
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, './src/assets/less/global.less')]
        }
    }
};
