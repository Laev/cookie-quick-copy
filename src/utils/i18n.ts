import { createI18n } from "vue-i18n";
import en from "@/locales/en";
import zh from "@/locales/zh";

const getLocale = () => {
  const lang = navigator.language.toLowerCase();
  return lang.includes('zh') ? 'zh' : 'en';
}

const i18n = createI18n({
  locale: getLocale(), // 默认语言
  fallbackLocale: "en", // 备用语言
  messages: {
    en,
    zh
  }
});

export default i18n;
