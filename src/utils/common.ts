import { getDomain } from 'tldjs'

/**
 * 获取网站以点开头的Domain
 * @param  {string}  url [网站地址]
 */
export function getWebDomain(url: string): string {
  const domain = getDomain(url)
  if (domain) {
    return `.${domain}`
  }
  return new URL(url).hostname
}

/**
 * 格式化网址为最简单的符合权限的格式
 * @param  {string}  url [网站地址]
 */
export function getFormatUrl(url: string): string {
  if (!url.includes('http:') && !url.includes('https:')) {
    url = 'http://' + url
  }
  const formatUrl = new URL(url)
  return `${formatUrl.protocol}//${formatUrl.host}/`
}

// 判断是否为开发环境
export function isDevEnvironment(url: string): boolean {
  const domain = getWebDomain(url);
  return (
    domain.includes('localhost') ||
    domain.includes('127.0.0.1') ||
    domain.startsWith('192.168.')
  );
}

// 开发环境下的域名匹配逻辑
export function isDevDomainMatch(cookieDomain: string, fromUrl: string): boolean {
  // 解析源URL
  const sourceUrl = new URL(fromUrl);
  const sourceHostname = sourceUrl.hostname;
  
  // 移除可能存在的端口号
  const cleanCookieDomain = cookieDomain.split(':')[0];
  const cleanSourceHostname = sourceHostname.split(':')[0];
  
  // localhost 匹配
  if (cleanSourceHostname === 'localhost' && cleanCookieDomain === 'localhost') {
    return true;
  }
  
  // IP地址匹配
  if (isIPAddress(cleanSourceHostname)) {
    return cleanCookieDomain === cleanSourceHostname;
  }
  
  return false;
}

// 判断是否为IP地址
function isIPAddress(domain: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
}

// 处理cookie domain映射
// 如果源cookie是设置在 .sub.example.com，目标域名是 target.com，则会相应设置为 .sub.target.com
// 如果源cookie是设置在根域名 .example.com，则目标cookie也会设置在根域名 .target.com
export function mapCookieDomain(sourceDomain: string, targetUrl: string): string {
  // 处理开发环境
  if (isDevEnvironment(targetUrl)) {
    return getWebDomain(targetUrl);
  }
  
  const sourceBase = sourceDomain.startsWith('.') ? sourceDomain.slice(1) : sourceDomain;
  const targetDomain = getWebDomain(targetUrl).slice(1); // 移除开头的点
  
  // 如果源domain是完整子域名
  if (sourceBase.indexOf('.') !== sourceBase.lastIndexOf('.')) {
    const sourceParts = sourceBase.split('.');
    const targetParts = targetDomain.split('.');
    const subdomainCount = sourceParts.length - 2; // 减去顶级域名部分
    
    // 保持相同的子域名层级
    if (targetParts.length >= 2) {
      return '.' + targetParts.slice(Math.max(0, targetParts.length - 2 - subdomainCount)).join('.');
    }
  }
  
  // 默认返回目标根域名
  return '.' + targetDomain;
}


/**
 * 确保 URL 格式完整
 * @param url 输入的URL
 * @returns 格式化后的URL
 */
export function ensureFullUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `http://${url}`
  }
  return url
}

