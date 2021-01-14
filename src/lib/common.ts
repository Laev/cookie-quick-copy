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
