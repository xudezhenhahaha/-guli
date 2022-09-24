const { override, fixBabelImports, addLessLoader ,adjustStyleLoaders } = require('customize-cra');

module.exports = override(
    // 针对antd实现按需打包，根据import来打包(使用babel-plugin-import)
    fixBabelImports('import', { 
        libraryName: 'antd', 
        libraryDirectory: 'es',
        // style: 'css', //自动打包引入相关的css样式
        
        style: true,
    }),
    addLessLoader({ 
        lessOptions: {
            javascriptEnabled: true, 
            modifyVars: { '@primary-color': '#1DA57A' },
        },
    }),
    adjustStyleLoaders(({ use: [, , postcss] }) => {
        const postcssOptions = postcss.options;
        postcss.options = { postcssOptions };
    }),
);
