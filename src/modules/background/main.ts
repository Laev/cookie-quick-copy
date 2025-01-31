import CONFIG from "@/config";
import { getStorage } from "@/utils/chrome-api";
import { useCookieSync } from '@/hooks/useCookieSync';

// 类型定义
interface PopupFormData {
  sync?: boolean;
  fromUrl?: string;
  toUrl?: string;
}

// Cookie同步监听器
let cookieSyncListener: ((changeInfo: chrome.cookies.CookieChangeInfo) => void) | null = null;
const { copyCookie, createIncrementalSync } = useCookieSync();
/**
 * 清理现有的cookie监听器
 */
function cleanupCookieSync(): void {
  if (cookieSyncListener) {
    chrome.cookies.onChanged.removeListener(cookieSyncListener);
    cookieSyncListener = null;
  }
}

/**
 * 验证同步URL是否有效
 */
function isValidSyncUrls(fromUrl: string, toUrl: string): boolean {
  return Boolean(fromUrl && toUrl);
}

/**
 * 设置cookie同步
 * 包括全量同步和增量同步的设置
 */
async function setupCookieSync(): Promise<void> {
  try {
    // 清理现有监听器
    cleanupCookieSync();
    
    // 获取存储的表单数据
    const storage = await getStorage();
    const popupForm = storage?.[CONFIG.STORAGE_KEY_NAMESPACE] as PopupFormData || {};
    
    // 检查是否启用同步
    if (!popupForm?.sync) {
      return;
    }

    const { fromUrl = "", toUrl = "" } = popupForm;
    
    // 验证URL
    if (!isValidSyncUrls(fromUrl, toUrl)) {
      console.warn('Invalid sync URLs');
      return;
    }

    // 执行全量同步
    await copyCookie(fromUrl, toUrl, { showMessage: false });

    // 设置增量同步监听器
    cookieSyncListener = createIncrementalSync(fromUrl, toUrl);
    chrome.cookies.onChanged.addListener(cookieSyncListener);
    
  } catch (error) {
    console.error('Failed to setup cookie sync:', error);
  }
}

// 监听存储变更
chrome.storage.onChanged.addListener((changes) => {
  if (changes[CONFIG.STORAGE_KEY_NAMESPACE]) {
    setupCookieSync();
  }
});

// Service Worker 生命周期管理
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  setupCookieSync();
});

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    setupCookieSync();
  });
});

// 初始化同步设置
setupCookieSync();
