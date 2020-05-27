// init
document.addEventListener("DOMContentLoaded", function () {
  setDefToUrl();
  const message = new errorHandler();
  document
    .querySelector(".popup-btn")
    .addEventListener("click", async function () {
      message.destroy();
      const fromUrl = document.querySelector(".from-url").value;
      const fromKey = document.querySelector(".from-key").value;
      const toUrl = document.querySelector(".to-url").value;
      if (!fromUrl || !fromKey || !toUrl) {
        message.warning("请填写完整配置");
        return false;
      }
      let cookie = {};
      // 验证来源地址权限
      const hasSourcePermission = await permissionsContains(fromUrl);
      if (!hasSourcePermission) {
        const isPassGet = await requestPermissions(fromUrl);
        if (isPassGet) {
          cookie = await getCookie(fromUrl, fromKey);
        } else {
          message.error("操作不被允许，请授予权限");
        }
        return;
      } else {
        cookie = await getCookie(fromUrl, fromKey);
      }
      // 未获取到的异常处理
      if (!cookie) {
        message.warning("未获取到源网站cookie值");
        return;
      }
      // 验证目标地址权限
      const hasTargetPermission = await permissionsContains(toUrl);
      const { value, path, expirationDate } = cookie;
      if (!hasTargetPermission) {
        const isPassSet = await requestPermissions(fromUrl);
        if (isPassSet) {
          setCookie(toUrl, fromKey, value, {
            domain: getHostFromUrl(toUrl),
            path,
            expirationDate,
          })
            .then(() => {
              message.success("设置成功");
            })
            .catch(() => {
              message.error("设置失败");
            });
        } else {
          message.error("操作不被允许，请授予权限");
        }
        return;
      } else {
        setCookie(toUrl, fromKey, value, {
          domain: getHostFromUrl(toUrl),
          path,
          expirationDate,
        })
          .then(() => {
            message.success("设置成功");
          })
          .catch(() => {
            message.error("设置失败");
          });
      }
    });
});
