// TODO 设置cookie已完成，还需主动获取当前tab页的网址，需与另外的js通信
document.addEventListener('DOMContentLoaded', function () {

  document.querySelector('.popup-btn').addEventListener('click',async function(){
    var fromUrl = document.querySelector('.from-url').value
    var fromKey = document.querySelector('.from-key').value
    var toUrl = document.querySelector('.to-url').value || 'http://test.laev.top/'
      if (!fromUrl && !fromKey) {
        alert('url,key不能为空')
        return false
      }

    await permissionsContains(fromUrl)
    const cookie = await getCookie(fromUrl, fromKey)
    await permissionsContains(toUrl)
    setCookie(toUrl, fromKey, cookie.value)
  })

});

function permissionsContains(url, opt = []) {
  return new Promise(function(res, rej) {
    chrome.permissions.contains({
      permissions: ['cookies'],
      origins: [url, ...opt]
    }, function(result) {
      if (result) {
        res(result)
      } else {
        // 扩展程序没有这些权限。
        alert('请前往插件设置打开权限')
        rej(result)
      }
    })
  })
}

function getCookie(url, name, opt = {}) {
  return new Promise(function (res, rej) {
    chrome.cookies.get(({
      url,
      name,
      ...opt
    }),function(cookie) {
      if (cookie) {
        res(cookie)
      } else {
        rej(false)
      }
    })
  })
}

function setCookie(url, name, value, opt = {}) {
  console.log({
    url,
    name,
    value,
    ...opt
  }, 'setCookie')
  return new Promise(function (res, rej) {
    chrome.cookies.set(({
      url,
      name,
      value,
    }),function(cookie) {
      if (cookie) {
        res(cookie)
      } else {
        rej(false)
      }
    })
  })
}