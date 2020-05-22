// init
document.addEventListener("DOMContentLoaded", function () {
  setDefToUrl();
  var message = new errorHandler();
  document
    .querySelector(".popup-btn")
    .addEventListener("click", async function () {
      message.destroy();
      var fromUrl = document.querySelector(".from-url").value;
      var fromKey = document.querySelector(".from-key").value;
      var toUrl = document.querySelector(".to-url").value;
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
        message.success("设置成功");
      })
      .catch(() => {
        message.error("设置失败");
      });
    });
});

/**
 * 获取激活tab host 及设置默认值
 */
function setDefToUrl() {
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

/**
 * 提示消息
 */
class errorHandler {
  constructor() {
    this.domClass = ".popup-message";
    this.messageDom = document.querySelector(this.domClass);
    // 如未检测到则创建
    if (!this.messageDom) {
      this.messageDom = document.createElement("div");
      this.messageDom.class = domClass;
      document.body.appendChild(this.containerEl);
    }
  }
  show({ type = "info", text = "" }) {
    this.destroy();
    this.messageDom.innerHTML = text;
    this.messageDom.classList.add(type);
  }
  destroy() {
    this.messageDom.innerHTML = "";
    this.messageDom.classList.remove("success", "info", "error", "warning");
  }
  success(text) {
    this.show({ type: "success", text });
  }
  info(text) {
    this.show({ type: "info", text });
  }
  error(text) {
    this.show({ type: "error", text });
  }
  warning(text) {
    this.show({ type: "warning", text });
  }
}

/**
 * 获取地址host
 */
function getHostFromUrl(url) {
  return new URL(url).hostname;
}

/**
 * 查看权限
 * @param  {string}  url  [需要请求相关权限的目标URL]
 * @param  {array}   otherPermission  [额外权限]
 */
function permissionsContains(url, otherPermission = []) {
  return new Promise((resolve) => {
    chrome.permissions.contains(
      {
        permissions: ["cookies", ...otherPermission],
        origins: [url],
      },
      function (res) {
        resolve(res);
      }
    );
  });
}

/**
 * 请求权限
 * @param  {string}  url  [需要请求相关权限的目标URL]
 * @param  {array}   otherPermission  [额外权限]
 */
function requestPermissions(url, otherPermission = []) {
  // 权限必须在用户操作下请求，例如按钮单击的事件处理函数。
  return new Promise((resolve) => {
    chrome.permissions.request(
      {
        permissions: ["cookies", ...otherPermission],
        origins: [url],
      },
      function (granted) {
        // 如果用户授予了这些权限，则回调函数的参数为 true。
        resolve(granted);
      }
    );
  });
}

/**
 * 获取cookie
 * @param  {string}  url  [需要获取的 Cookie 相关联的 URL]
 * @param  {string}  name [cookie 名称]
 * @param  {object}  opt  [额外参数]
 */
function getCookie(url, name, opt = {}) {
  return new Promise(function (resolve) {
    chrome.cookies.get(
      {
        url,
        name,
        ...opt,
      },
      function (cookie) {
        if (cookie) {
          resolve(cookie);
        } else {
          resolve(false);
        }
      }
    );
  });
}

/**
 * 设置cookie
 * @param  {string}  url   [需要设置的 Cookie 相关联的 URL]
 * @param  {string}  name  [cookie 名称]
 * @param  {string}  value [cookie 值]
 * @param  {object}  opt  [额外参数]
 */
function setCookie(url, name, value, opt = {}) {
  return new Promise(function (resolve, reject) {
    chrome.cookies.set(
      {
        url,
        name,
        value,
        ...opt,
      },
      function (cookie) {
        if (cookie) {
          resolve(cookie);
        } else {
          reject(false);
        }
      }
    );
  });
}
