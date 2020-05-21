# cookie-quick-copy

## 简述

一款快速复制某网站指定键与键值至当前已激活标签页的谷歌插件

> v1 版本只支持固定复制 [广电云测试服](http://consoles.dev.guangdianyun.tv/) 下 CONSOLE_TOKEN_GDY键
> V2 版本支持用户输入复制指定网站指定键&键值

### 目录结构

```
├── background.js        // 后台脚本
├── images               // 图标文件
│   ├── icon_128x128.png // 扩展程序页面上的图标
│   ├── icon_16x16.png   // Windows计算机通常需要此大小。提供此选项可防止尺寸失真缩小48x48选项。
│   ├── icon_32x32.png   // 显示在扩展程序管理页面上
│   └── icon_48x48.png   // 在安装和Chrome Webstore中显示
├── manifest.json        // 清单文件
├── popup.html           // 扩展程序的 UI 页面
└── popup.js             // 扩展程序的 js 脚本
```
## 调试

1. 拉取

   ```shell
   git clone https://github.com/Laev/cookie-quick-copy.git
   ```

2. 在打开谷歌浏览器右上角菜单>更多工具>扩展程序>加载已解压的扩展程序

## 相关文档

[chrome API](https://crxdoc-zh.appspot.com/extensions/api_index#stable_apis)

[一篇文章教你顺利入门和开发chrome扩展程序](https://juejin.im/post/5c135a275188257284143418)

[手把手教你开发一个 chrome 扩展程序](https://juejin.im/post/5e58c06d51882549331cf0ed)




