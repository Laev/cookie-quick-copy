/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve, join } = require("path");
const { defineConfig } = require("@vue/cli-service");
const { version } = require("./package.json");
const { getEntry, getMultiPageConf } = require("./scripts/multi-page-config");
const fs = require("fs");
const AdmZip = require("adm-zip");
const ChromeExtension = require("crx");
const TerserPlugin = require("terser-webpack-plugin");

/* constant */
const contentOutputDir = "dist/cookie-quick-copy"; // 打包输出目录
const packagesOutputDir = "dist"; // zip&crx输出目录

/* 多页应用配置 自动按照getEntry入参划分 ** 详见getEntry&getMultiPageConf函数 ** */
const chromeScripts = getEntry("src/modules/*");
const pages = getMultiPageConf(chromeScripts);

// 定义打包插件类
class PackageExtensionPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      "PackageExtension",
      async (compilation, callback) => {
        try {
          const args = process.argv;
          const shouldZip = args.includes("--zip");
          const shouldCrx = args.includes("--crx");
          const outputPath = resolve(__dirname, packagesOutputDir);

          // 确保输出目录存在
          if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
          }

          // 只在指定参数或 build:all 时执行打包
          if (shouldZip || args.includes("--all")) {
            const zip = new AdmZip();
            zip.addLocalFolder(resolve(__dirname, contentOutputDir));
            zip.writeZip(join(outputPath, "cookie-quick-copy.zip"));
            console.log("ZIP package created successfully");
          }

          if (shouldCrx || args.includes("--all")) {
            const crx = new ChromeExtension({
              privateKey: fs.readFileSync(
                resolve(__dirname, "src/extension/cookie-quick-copy.pem")
              ),
            });

            await crx.load(resolve(__dirname, contentOutputDir));
            const crxBuffer = await crx.pack();
            fs.writeFileSync(
              join(outputPath, "cookie-quick-copy.crx"),
              crxBuffer
            );
            console.log("CRX package created successfully");
          }

          callback();
        } catch (err) {
          console.error("Packaging failed:", err);
          callback(err);
        }
      }
    );
  }
}

module.exports = defineConfig({
  outputDir: contentOutputDir,
  assetsDir: "assets",
  pages,
  // 在 watch 模式下启用 source map
  productionSourceMap: process.argv.includes('--watch'),
  css: {
    extract: {
      filename: "css/[name].css",
    },
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  chainWebpack(config) {
    // 添加 service worker 配置
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: "chunk-vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: (chunk) => chunk.name !== "background",
        },
      },
    });

    config
      .plugin("copy")
      .use("copy-webpack-plugin")
      .tap((args) => {
        args.push({
          patterns: [
            {
              from: resolve("src/assets"),
              to: resolve(`${resolve(contentOutputDir)}/assets`),
            },
            {
              from: resolve("src/extension/manifest.json"),
              to: `${resolve(contentOutputDir)}/manifest.json`,
              transform(content) {
                return content.toString().replace("__VERSION__", version);
              },
            },
          ],
        });
        return args;
      });

    // 添加 CSP 配置
    if (process.env.NODE_ENV === "production") {
      config.plugin("html-popup").tap((args) => {
        args[0].meta = {
          "Content-Security-Policy": {
            "http-equiv": "Content-Security-Policy",
            content: "script-src 'self'; object-src 'self'",
          },
        };
        return args;
      });
    }
    if (process.env.NODE_ENV === "production") {
      config.output.filename("js/[name].js").end();
      config.output.chunkFilename("js/[name].js").end();
    }

    if (process.env.NODE_ENV === "production") {
      // 先使用 use() 定义插件
      config
        .plugin("package-extension")
        .use(PackageExtensionPlugin)
        .end();
    }

    // 在 watch 模式下禁用代码压缩
    if (process.argv.includes('--watch')) {
      config.optimization.minimize(false);
    }
  },
  configureWebpack: {
    output: {
      filename: "js/[name].js",
    },
    resolve: {
      fallback: {
        url: require.resolve("url/"),
      },
    },
    // 在 watch 模式下配置 terser
    optimization: {
      minimize: !process.argv.includes('--watch'),
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: !process.argv.includes('--watch'),
            mangle: !process.argv.includes('--watch')
          },
        }),
      ],
    }
  },
});
