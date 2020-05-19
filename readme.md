## cookie-quick-copy

一款快速复制某网站指定键与键值至当前已激活标签页的谷歌插件

> v1 版本只支持固定复制 [广电云测试服](http://console.dev.guangdianyun.tv/) 下 CONSOLE_TOKEN_GDY键
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
