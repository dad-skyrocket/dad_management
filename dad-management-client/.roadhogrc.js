const path = require('path')
const { version } = require('./package.json')

const svgSpriteDirs = [
    path.resolve(__dirname, 'src/svg/'),
    require.resolve('antd').replace(/index\.js$/, '')
]

export default {
    entry: 'src/index.js',
    svgSpriteLoaderDirs: svgSpriteDirs,
    theme: "./theme.config.js",
    publicPath: `/${version}/`,
    outputPath: `./dist/${version}`,
    // 接口代理示例
    proxy: {
        "/api/v1/weather": {
            "target": "https://api.seniverse.com/",
            "changeOrigin": true,
            "pathRewrite": { "^/api/v1/weather": "/v3/weather" }
        },
        '/api/v1/user': {
            "target": "http://127.0.0.1:7001",
            "changeOrigin": true,
        },
        '/api/v1/campaign': {
            "target": "http://127.0.0.1:7001",
            "changeOrigin": true,
        },
        '/api/v1/slot': {
            "target": "http://127.0.0.1:7001",
            "changeOrigin": true,
        },
        // '/api/v1/advertiser': {
        //     "target": "http://127.0.0.1:7001",
        //     "changeOrigin": true,
        // },
        // '/api/v1/conversion': {
        //     "target": "http://127.0.0.1:7001",
        //     "changeOrigin": true,
        // },
        // '/api/v1/report': {
        //     "target": "http://127.0.0.1:7001",
        //     "changeOrigin": true,
        // },
        '/api/v1/upload': {
            "target": "http://127.0.0.1:7001",
            "changeOrigin": true,
        },
        '/api/v1/menus': {
            "target": "http://127.0.0.1:7001",
            "changeOrigin": true,
        },
        // "/api/v2": {
        //   "target": "http://192.168.0.110",
        //   "changeOrigin": true,
        //   "pathRewrite": { "^/api/v2" : "/api/v2" }
        // }
    },
    env: {
        development: {
            extraBabelPlugins: [
                "dva-hmr",
                "transform-runtime",
                [
                    "import", {
                        "libraryName": "antd",
                        "style": true
                    }
                ]
            ]
        },
        production: {
            extraBabelPlugins: [
                "transform-runtime",
                [
                    "import", {
                        "libraryName": "antd",
                        "style": true
                    }
                ]
            ]
        }
    },
    dllPlugin: {
        exclude: [ "babel-runtime", "roadhog", "cross-env" ],
        include: [ "dva/router", "dva/saga", "dva/fetch" ]
    },
    extraBabelIncludes: [
        "./node_modules/get-stream",
        "./node_modules/got",
    ]
}
