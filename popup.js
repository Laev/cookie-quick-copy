const STORAGE_KEY = "cookieQcopy";

// init
document.addEventListener("DOMContentLoaded", function () {
  setDefVaule();
  const message = new errorHandler();
  document
    .querySelector(".popup-btn")
    .addEventListener("click", async function () {
      message.destroy();
      const fromUrl = document.querySelector(".from-url").value;
      const fromKey = document.querySelector(".from-key").value;
      const toUrl = document.querySelector(".to-url").value;
      const urlReg = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
      const specialUrls = ['http://localhost']
      if (!fromUrl || !fromKey || !toUrl) {
        message.warning("请填写完整配置");
        return;
      }
      if (!urlReg.test(fromUrl) && !fromUrl.includes(specialUrls)) {
        message.warning("源网站网址格式不正确");
        return;
      }
      if (!urlReg.test(toUrl) && !toUrl.includes(specialUrls)) {
        message.warning("目标网站网址格式不正确");
        return;
      }
      let cookie = {};
      // 验证来源地址权限
      const hasSourcePermission = await permissionsContains(fromUrl);
      if (!hasSourcePermission) {
        const isPassGet = await requestPermissions(fromUrl);
        if (!isPassGet) {
          message.error("操作不被允许，请授予权限");
          return;
        }
      }
      cookie = await getCookie(fromUrl, fromKey);
      // 未获取到的异常处理
      if (!cookie) {
        message.warning("未获取到源网站cookie值");
        return;
      }
      // 验证目标地址权限
      const hasTargetPermission = await permissionsContains(toUrl);
      const { value, path, expirationDate } = cookie;
      if (!hasTargetPermission) {
        const isPassSet = await requestPermissions(fromUrl, "storage");
        if (!isPassSet) {
          message.error("操作不被允许，请授予权限");
          return;
        }
      }
      setCookie(toUrl, fromKey, value, {
        domain: getHostFromUrl(toUrl),
        path,
        expirationDate,
      })
        .then(() => {
          setStorage({
            [STORAGE_KEY]: {
              fromUrl,
              fromKey,
            },
          });
          message.success("设置成功");
        })
        .catch(() => {
          message.error("设置失败");
        });
    });
});

/**
 * 设置默认值
 */
function setDefVaule() {
  // 设置存储中的结果
  getStorage(STORAGE_KEY).then((res) => {
    if (res && STORAGE_KEY in res) {
      const { fromUrl, fromKey } = res[STORAGE_KEY];
      document.querySelector(".from-url").value = fromUrl;
      document.querySelector(".from-key").value = fromKey;
    }
  });
  // 获取激活tab host 并设置
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      document.querySelector(".to-url").value = tabs[0].url;
    }
  );
}
