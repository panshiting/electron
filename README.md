## 一个简单的Electron应用
#### [Electron文档]（https://electronjs.org/docs/tutorial/first-app）

#### 目录结构描述  

```
├── README.md
├── dist                       // 打包后的文件夹
├── index.js                   // 入口文件
├── static                     // vue项目打包
├── index.html                 // vue项目打包
├── node_modules
├── package.json               // 配置文件
└── package-loack.json
```

#### electron-packager 和 electron-builder打包的区别  
"electron-packager"：直接生成解压后的文件  
"electron-builder": 生成两种形式的文件，一种是解压后的文件，一种是未解压的exe文件，支持多平台，支持自动更新，除此之外，electron-builder打出的包更为轻量，并且可以打包出不暴露源码的setup安装程序。