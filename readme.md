# cookie-quick-copy

## 简述（Introduction）

一款快捷同步网站cookie至目标网站的谷歌插件，基于vue-cli4.x(vue3.0) + typescript + ant-design-vue 开发

### 特性（Features）

1. 支持cookie全量复制至目标网站
2. 支持自动同步功能
3. 支持自动备份插件配置至个人账户

### 未来（Future）

1. 支持多份配置，并增加配置列表
2. 支持exclude字段，排除不需要同步的字段
3. 支持同步网站local storage

### 目录结构（只展示核心部分）

```
├── cookie-quick-copy            // 最终生成的dist文件
├── cookie-quick-copy_packages   // 生成zip/crx文件
├── src
│   ├── assets                   // 放置图标、图片、css等静态文件
│   ├── components               // 公共组件文件夹
│   ├── config                   // 放置chrome插件所需的配置文件或密钥等
│   ├── lib                      // 公共方法库
│   ├── modules                  // 谷歌插件的几个核心模块部分popup、background、content
│   └── types                    // typescript 声明文件统一放置处
```

### 项目运行及调试（Run）

```
yarn install
```

```
yarn serve // 限于chrome api 该调试模式只能简单调试部分样式
// 或
yarn watch // 运行后将项目子文件夹cookie-quick-copy 导入至浏览器中即可调试
```

### 项目打包（Build）
```
yarn build // 打包已解压后的插件
// 或
yarn build:zip // 打包zip文件
// 或
yarn build:crx // 打包crx文件
```

### 图标说明（Icons）

本插件LOGO源于iconfont，版权所属[Crazy、晓鸢](https://www.iconfont.cn/user/detail?spm=a313x.7781069.0.d214f71f6&uid=56212)

### 相关文档（Doc）

[chrome API（官方）](https://developer.chrome.com/docs/extensions/reference/)

[chrome API（第三方）](https://crxdoc-zh.appspot.com/extensions/api_index#stable_apis)

[一篇文章教你顺利入门和开发chrome扩展程序](https://juejin.im/post/5c135a275188257284143418)

[手把手教你开发一个 chrome 扩展程序](https://juejin.im/post/5e58c06d51882549331cf0ed)

[说说Chrome插件从开发调试到打包发布](https://juejin.im/post/5b55a98ce51d4519873f57af)

### 版权（License）

MIT
