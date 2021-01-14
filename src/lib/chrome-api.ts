import { Tab, StorageResponse } from '@/types/chrome-api'
import CONFIG from './config'
/**
 * 获取当前tab
 * @param  {function}  cb  [回调函数]
 */
function getCurrentTab(cb: (tabs: Tab) => void) {
  try {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      (tabs: Tab) => {
        cb && cb(tabs)
      }
    )
  } catch (error) {
    console.log(error)
  }
}

/**
 * 查看权限
 * @param  {string}  url  [需要请求相关权限的目标URL]
 * @param  {array}   otherPermission  [额外权限参数]
 */
function permissionsContains(url: string, otherPermission: Array<string> = []) {
  return new Promise(resolve => {
    chrome.permissions.contains(
      {
        permissions: ['cookies', ...otherPermission],
        origins: [url]
      },
      function(res) {
        resolve(res)
      }
    )
  })
}

/**
 * 请求权限
 * @param  {string}  url  [需要请求相关权限的目标URL]
 * @param  {array}   otherPermission  [额外权限参数]
 */
function requestPermissions(url: string, otherPermission: Array<string> = []) {
  // 权限必须在用户操作下请求，例如按钮单击的事件处理函数。
  return new Promise(resolve => {
    chrome.permissions.request(
      {
        permissions: ['cookies', ...otherPermission],
        origins: [url]
      },
      function(granted) {
        // 如果用户授予了这些权限，则回调函数的参数为 true。
        resolve(granted)
      }
    )
  })
}

/**
 * 获取cookie
 * @param  {string}  url  [需要获取的 Cookie 相关联的 URL]
 * @param  {string}  name [cookie 名称]
 * @param  {object}  opt  [额外参数]
 */
function getCookie(url: string, name: string, opt: { [key: string]: string } = {}) {
  return new Promise(function(resolve) {
    chrome.cookies.get(
      {
        url,
        name,
        ...opt
      },
      function(cookie) {
        if (cookie) {
          resolve(cookie)
        } else {
          resolve(null)
        }
      }
    )
  })
}

/**
 * 获取所有cookie
 * @param  {string}  url  [需要获取的 Cookie 相关联的 URL]
 * @param  {object}  opt  [额外参数]
 */
function getAllCookie(url: string, opt: { [key: string]: string } = {}) {
  return new Promise(function(resolve) {
    chrome.cookies.getAll(
      {
        url,
        ...opt
      },
      function(cookie) {
        if (cookie) {
          resolve(cookie)
        } else {
          resolve(null)
        }
      }
    )
  })
}

/**
 * 设置cookie
 * @param  {string}  url   [需要设置的 Cookie 相关联的 URL]
 * @param  {object}  opt  [额外参数]
 */
function setCookie(url: string, opt: { [key: string]: string | number | undefined } = {}) {
  return new Promise(function(resolve, reject) {
    chrome.cookies.set(
      {
        url,
        ...opt
      },
      function(cookie) {
        if (cookie) {
          resolve(cookie)
        } else {
          reject(false)
        }
      }
    )
  })
}

/**
 * 从storage中读取
 * @return  {promise}
 */
function getStorage(): Promise<StorageResponse> {
  return new Promise(resolve => {
    chrome.storage.sync.get(CONFIG.STORAGE_KEY_NAMESPACE, saved => {
      if (saved) {
        resolve(saved)
      } else {
        resolve(null)
      }
    })
  })
}

/**
 * 设置存储到storage中
 * @param  {object}  value [存储的数据对象]
 * @param  {function}  cb [回调函数]
 */
function setStorage(value = {}, cb?: () => void) {
  chrome.storage.sync.set({ [CONFIG.STORAGE_KEY_NAMESPACE]: value }, cb)
}

/**
 * 移除storage中的数据
 * @param  {string}  value [存储的数据对象]
 * @param  {function}  cb [回调函数]
 */
function removeStorage(value: string, cb?: () => void) {
  chrome.storage.sync.remove(value, cb)
}

export {
  getCurrentTab,
  permissionsContains,
  requestPermissions,
  getCookie,
  getAllCookie,
  setCookie,
  getStorage,
  setStorage,
  removeStorage
}
