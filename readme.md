# cookie-quick-copy

## 简述

一款快速复制某网站指定键与键值至当前已激活标签页的谷歌插件

### 已支持的功能

1. 支持开放配置源地址、源地址cookie键、目标地址
2. 打开窗口后将会读取你上一次设置成功的结果

### 目录结构

```
├── images                 // 图标文件
│   ├── icon_128x128.png   // 扩展程序页面上的图标
│   ├── icon_16x16.png     // Windows计算机通常需要此大小。提供此选项可防止尺寸失真缩小48x48选项。
│   ├── icon_32x32.png     // 显示在扩展程序管理页面上
│   └── icon_48x48.png     // 在安装和Chrome Webstore中显示
├── manifest.json          // 清单文件
├── popup.html             // 扩展程序的 UI 页面
├── popup.js               // 扩展程序的 js 脚本
└── utils                  // 存放工具类
    └── common.js          // 公用函数
```
## 调试

1. 拉取

   ```shell
   git clone https://github.com/Laev/cookie-quick-copy.git
   ```

2. 在打开谷歌浏览器右上角菜单>更多工具>扩展程序>加载已解压的扩展程序

3. 如果你需要调试popup.js的内容，可以右键点击插件图标>审查弹出内容

## 相关文档

[chrome API](https://crxdoc-zh.appspot.com/extensions/api_index#stable_apis)

[一篇文章教你顺利入门和开发chrome扩展程序](https://juejin.im/post/5c135a275188257284143418)

[手把手教你开发一个 chrome 扩展程序](https://juejin.im/post/5e58c06d51882549331cf0ed)

[说说Chrome插件从开发调试到打包发布](https://juejin.im/post/5b55a98ce51d4519873f57af)




