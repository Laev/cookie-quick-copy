// import hotReload from '@/lib/hotReload'
// hotReload()

import CONFIG from '@/lib/config'
import { getWebDomain } from '@/lib/common'
import { getStorage, setCookie } from '@/lib/chrome-api.ts'

getStorage().then(res => {
  if (res && Object.keys(res).length > 0) {
    const popupForm = res?.[CONFIG.STORAGE_KEY_NAMESPACE] || {}
    if (popupForm?.sync) {
      const fromUrl = popupForm?.fromUrl || ''
      const toUrl = popupForm?.toUrl || ''
      chrome.cookies.onChanged.addListener(function(changeInfo) {
        if (
          (changeInfo?.cause === 'explicit' || changeInfo?.cause === 'overwrite') &&
          changeInfo?.cookie?.domain === getWebDomain(fromUrl) &&
          !changeInfo?.removed
        ) {
          const { name, value, path, expirationDate } = changeInfo.cookie
          setCookie(toUrl, {
            domain: getWebDomain(toUrl),
            name,
            value,
            path,
            expirationDate
          })
        }
      })
    }
  }
})
