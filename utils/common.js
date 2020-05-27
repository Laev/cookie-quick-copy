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
      this.init()
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
    init() {
      ["success", "info", "error", "warning"].forEach((type) => {
        this[type] = (text) => {
          this.show({ type, text });
        };
      });
    }
  }

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