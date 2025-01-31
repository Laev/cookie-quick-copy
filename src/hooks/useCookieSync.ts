import { message } from 'ant-design-vue';
import { getWebDomain, getFormatUrl, mapCookieDomain, isDevEnvironment, isDevDomainMatch } from '@/utils/common';
import type { Cookie } from '@/types/chrome-api';
import { 
  permissionsContains,
  requestPermissions,
  getAllCookie,
  setCookie
} from '@/utils/chrome-api';
import i18n from "@/utils/i18n";


// Cookie 同步相关的错误类型
enum CookieSyncErrorType {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NO_COOKIES = 'NO_COOKIES', 
  SYNC_FAILED = 'SYNC_FAILED'
}

interface CookieSyncOptions {
  showMessage?: boolean;
  cookieSettings?: Partial<chrome.cookies.SetDetails>;
}

interface CookieSyncResult {
  success: boolean;
  error?: CookieSyncErrorType;
  message?: string;
}

export function useCookieSync() {
  // 只在顶层调用一次useI18n
  const t = i18n.global.t

  const handleError = (
    error: CookieSyncErrorType,
    key: string,
    showMessage: boolean
  ): CookieSyncResult => {
    const result = {
      success: false,
      error,
      message: t(key)
    };
    showMessage && message.error(result.message);
    return result;
  };

  // 获取环境相关的 cookie 设置
  const getCookieSettings = (toUrl: string): Partial<chrome.cookies.SetDetails> => {
    const isDevEnv = isDevEnvironment(toUrl);
    return {
      secure: !isDevEnv,
      httpOnly: !isDevEnv,
      sameSite: isDevEnv ? 'lax' : 'strict' as chrome.cookies.SameSiteStatus
    };
  };

  // 验证并请求权限
  const retryPermissions = async (source: string): Promise<CookieSyncResult> => {
    try {
      if (await permissionsContains(source)) {
        return { success: true };
      }
      
      const isPass = await requestPermissions(source);
      if (!isPass) {
        return {
          success: false,
          error: CookieSyncErrorType.PERMISSION_DENIED,
          message: t('cookie.errors.permissionDenied')
        };
      }
      
      return { success: true };
    } catch (err) {
      console.error('Permission error:', err);
      return {
        success: false,
        error: CookieSyncErrorType.PERMISSION_DENIED,
        message: t('cookie.errors.permissionFailed')
      };
    }
  };

  // 基础cookie同步逻辑
  const syncCookies = async (
    cookies: Cookie[], 
    toUrl: string,
    options: CookieSyncOptions = {}
  ): Promise<CookieSyncResult> => {
    try {
      const defaultSettings = getCookieSettings(toUrl);
      const { cookieSettings = {} } = options;
      
      await Promise.all(cookies.map((item: Cookie) => {
        return setCookie({
          url: toUrl,
          domain: getWebDomain(toUrl),
          name: item.name,
          value: item.value,
          path: item.path,
          expirationDate: item.expirationDate,
          ...defaultSettings,
          ...cookieSettings
        });
      }));

      return { success: true };
    } catch (err) {
      console.error('Sync cookies error:', err);
      return handleError(
        CookieSyncErrorType.SYNC_FAILED,
        'cookie.errors.syncFailed',
        options.showMessage ?? true
      );
    }
  };

  // 复制cookie核心方法
  const copyCookie = async (
    fromUrl: string, 
    toUrl: string,
    options: CookieSyncOptions = {}
  ): Promise<CookieSyncResult> => {
    const { showMessage = true } = options;
    
    if(showMessage) {
      message.destroy();
    }
    
    fromUrl = getFormatUrl(fromUrl);
    toUrl = getFormatUrl(toUrl);
    
    try {
      // 验证源地址权限
      const fromPermResult = await retryPermissions(fromUrl);
      if (!fromPermResult.success) {
        showMessage && message.error(fromPermResult.message ?? t('common.operationFailed'));
        return fromPermResult;
      }

      // 获取源站cookie
      const cookies = await getAllCookie(fromUrl);
      if (!cookies?.length) {
        const result = {
          success: false,
          error: CookieSyncErrorType.NO_COOKIES,
          message: t('cookie.errors.noCookies')
        };
        showMessage && message.warning(result.message);
        return result;
      }

      // 验证目标地址权限
      const toPermResult = await retryPermissions(toUrl);
      if (!toPermResult.success) {
        showMessage && message.error(toPermResult.message ?? t('common.operationFailed'));
        return toPermResult;
      }

      // 同步cookie
      const syncResult = await syncCookies(cookies, toUrl, options);
      if (!syncResult.success) {
        showMessage && message.error(syncResult.message ?? t('common.operationFailed'));
        return syncResult;
      }
      
      showMessage && message.success(t('cookie.success.sync'));
      return { success: true };
    } catch (err) {
      console.error("Cookie sync error:", err);
      return handleError(
        CookieSyncErrorType.SYNC_FAILED,
        'cookie.errors.syncFailed',
        options.showMessage ?? true
      );
    }
  };

  // 同步单个 cookie 的实现
  const syncSingleCookie = async (
    cookie: chrome.cookies.Cookie,
    toUrl: string,
    options: CookieSyncOptions = {}
  ): Promise<CookieSyncResult> => {
    try {
      const defaultSettings = getCookieSettings(toUrl);
      const { cookieSettings = {} } = options;

      await setCookie({
        url: toUrl,
        domain: mapCookieDomain(cookie.domain, toUrl),
        name: cookie.name,
        value: cookie.value,
        path: cookie.path,
        expirationDate: cookie.expirationDate,
        ...defaultSettings,
        ...cookieSettings
      });

      return { success: true };
    } catch (err) {
      console.error('Sync single cookie error:', err);
      return handleError(
        CookieSyncErrorType.SYNC_FAILED,
        'cookie.errors.syncSingleFailed',
        options.showMessage ?? true
      );
    }
  };

  // 创建增量同步的变更监听器
  const createIncrementalSync = (fromUrl: string, toUrl: string) => {
    return async (changeInfo: chrome.cookies.CookieChangeInfo) => {
      const { cookie, removed } = changeInfo;
      if (removed || !cookie) return;

      const fromDomain = getWebDomain(fromUrl);
      const isDomainMatch = isDevEnvironment(fromUrl)
        ? isDevDomainMatch(cookie.domain, fromUrl)
        : cookie.domain === fromDomain;

      if (isDomainMatch) {
        await syncSingleCookie(cookie, toUrl);
      }
    };
  };

  return {
    copyCookie,
    retryPermissions,
    syncCookies,
    createIncrementalSync
  };
}
