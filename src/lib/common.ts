import { getDomain } from 'tldjs'

/**
 * 获取网站以点开头的Domain
 * @param  {string}  url [网站地址]
 */
export function getWebDomain(url: string) {
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
export function getFormatUrl(url: string) {
  if (!url.includes('http:') && !url.includes('https:')) {
    url = 'http://' + url
  }
  const formatUrl = new URL(url)
  return `${formatUrl.protocol}//${formatUrl.host}/`
}
