import { useI18n } from "vue-i18n";
import { isDevEnvironment } from '@/utils/common';

interface ValidationCallback {
  (error?: Error): void;
}

export function useUrlValidation() {
  const { t } = useI18n();

  // URL基础验证
  const validateUrlBase = (value: string): boolean => {
    return /^(((ht|f)tps?):\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s]*)?$/.test(value);
  };

  // 开发环境URL验证
  const validateDevUrl = (value: string): boolean => {
    try {
      new URL(value.startsWith('http') ? value : `http://${value}`);
      return true;
    } catch {
      return false;
    }
  };

  // 源网站URL验证
  const validateFromUrl = (
    rule: Array<string>,
    value: string,
    callback: ValidationCallback
  ) => {
    if (!value) {
      callback(new Error(t('validation.sourceRequired')));
      return;
    }

    if (isDevEnvironment(value)) {
      if (!validateDevUrl(value)) {
        callback(new Error(t('validation.invalidUrl')));
        return;
      }
    } else if (!validateUrlBase(value)) {
      callback(new Error(t('validation.invalidUrl')));
      return;
    }
    
    callback();
  };

  // 目标网站URL验证
  const validateToUrl = (
    rule: Array<string>,
    value: string,
    callback: ValidationCallback,
    fromUrl?: string
  ) => {
    if (!value) {
      callback(new Error(t('validation.targetRequired')));
      return;
    }

    // 检查是否与源网站相同
    if (fromUrl) {
      try {
        const fromUrlObj = new URL(fromUrl.startsWith('http') ? fromUrl : `http://${fromUrl}`);
        const toUrlObj = new URL(value.startsWith('http') ? value : `http://${value}`);
        
        if (fromUrlObj.hostname === toUrlObj.hostname && 
            (fromUrlObj.port || '80') === (toUrlObj.port || '80')) {
          callback(new Error(t('validation.sameUrl')));
          return;
        }
      } catch(err) {
        callback(new Error(t('validation.invalidUrl')));
        return;
      }
    }

    if (isDevEnvironment(value)) {
      if (!validateDevUrl(value)) {
        callback(new Error(t('validation.invalidUrl')));
        return;
      }
    } else if (!validateUrlBase(value)) {
      callback(new Error(t('validation.invalidUrl')));
      return;
    }
    
    callback();
  };

  return {
    validateFromUrl,
    validateToUrl
  };
} 
