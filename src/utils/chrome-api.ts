import type { Tab, StorageResponse } from '@/types/chrome-api'
import CONFIG from '@/config'
import { ensureFullUrl } from '@/utils/common'
/**
 * 获取当前激活的浏览器标签页
 * @returns Promise<Tab> 当前标签页信息
 */
export function getCurrentTab(): Promise<Tab> {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        (tabs: Tab) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
            return
          }
          resolve(tabs)
        }
      )
    } catch (error) {
      reject(error)
    }
  })
}

interface PermissionOptions {
  permissions: string[]
  origins: string[]
}

/**
 * 检查是否具有指定权限
 * @param url 目标URL
 * @param otherPermissions 其他所需权限
 * @returns Promise<boolean> 是否具有权限
 */
export function permissionsContains(url: string, otherPermissions: string[] = []): Promise<boolean> {
  const options: PermissionOptions = {
    permissions: ['cookies', ...otherPermissions],
    origins: [url]
  }
  
  return new Promise(resolve => {
    chrome.permissions.contains(options, resolve)
  })
}

/**
 * 请求指定权限
 * @param url 目标URL
 * @param otherPermissions 其他所需权限
 * @returns Promise<boolean> 是否获得权限
 */
export function requestPermissions(url: string, otherPermissions: string[] = []): Promise<boolean> {
  const options: PermissionOptions = {
    permissions: ['cookies', ...otherPermissions],
    origins: [url]
  }

  return new Promise(resolve => {
    chrome.permissions.request(options, granted => {
      resolve(granted)
    })
  })
}

interface CookieOptions {
  [key: string]: string
}

/**
 * 获取指定cookie
 * @param url 目标URL
 * @param name cookie名称
 * @param options 其他选项
 * @returns Promise<chrome.cookies.Cookie | null>
 */
export function getCookie(url: string, name: string, options: CookieOptions = {}): Promise<chrome.cookies.Cookie | null> {
  const fullUrl = ensureFullUrl(url)
  
  return new Promise((resolve, reject) => {
    chrome.cookies.get(
      {
        url: fullUrl,
        name,
        ...options
      },
      cookie => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
          return
        }
        resolve(cookie || null)
      }
    )
  })
}

/**
 * 获取所有cookie
 * @param url 目标URL
 * @param options 其他选项
 * @returns Promise<chrome.cookies.Cookie[]>
 */
export function getAllCookie(url: string, options: CookieOptions = {}): Promise<chrome.cookies.Cookie[]> {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll(
      {
        url,
        ...options
      },
      cookies => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
          return
        }
        resolve(cookies || [])
      }
    )
  })
}

/**
 * 设置cookie
 * @param details cookie详细信息
 * @returns Promise<chrome.cookies.Cookie>
 */
export function setCookie(details: chrome.cookies.SetDetails): Promise<chrome.cookies.Cookie> {
  return new Promise((resolve, reject) => {
    chrome.cookies.set(details, cookie => {
      if (chrome.runtime.lastError) {
        console.warn('Cookie operation failed:', chrome.runtime.lastError)
        reject(chrome.runtime.lastError)
        return
      }
      if (!cookie) {
        reject(new Error('Failed to set cookie'))
        return
      }
      resolve(cookie)
    })
  })
}

/**
 * 从storage中读取数据
 * @returns Promise<StorageResponse>
 */
export function getStorage(): Promise<StorageResponse> {
  return new Promise((resolve, reject) => {
    if (!chrome?.storage?.local) {
      reject(new Error('Chrome storage API not available'))
      return
    }
    
    chrome.storage.local.get(CONFIG.STORAGE_KEY_NAMESPACE, result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
        return
      }
      resolve(result)
    })
  })
}

/**
 * 将数据存储到storage中
 * @param data 要存储的数据
 * @returns Promise<void>
 */
export function setStorage(data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(
      { [CONFIG.STORAGE_KEY_NAMESPACE]: data },
      () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
          return
        }
        resolve()
      }
    )
  })
}

/**
 * 从storage中移除数据
 * @param key 要移除的键
 * @returns Promise<void>
 */
export function removeStorage(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.remove(key, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
        return
      }
      resolve()
    })
  })
}
