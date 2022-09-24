// 入口文件
// import React from 'react';
// import { createRoot } from 'react-dom/client';

// import App from './app'
// // 将App组件标签渲染到index页面的div上
// createRoot(document.getElementById('root')).render(<App/>)

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app'
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';

// 读取LocalStorage中的uesr信息,读取之后保存到内存中，之后就不需要再读取了
const user = storageUtils.getUser();
memoryUtils.user = user;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App/>)
