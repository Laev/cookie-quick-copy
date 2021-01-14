import { createApp } from 'vue'
import app from './views/app.vue'

function joinContent(element) {
  const div = document.createElement('div')
  div.id = 'joinContentApp'
  document.body.appendChild(div)
  // console.log(div)
  createApp(element).mount('#joinContentApp')
}

function injectJsInsert() {
  document.addEventListener('readystatechange', () => {
    const injectPath = 'js/inject.js'
    const script = document.createElement('script')

    script.setAttribute('type', 'text/javascript')
    // eslint-disable-next-line no-undef
    script.src = chrome.extension.getURL(injectPath)
    document.body.appendChild(script)
  })
}

joinContent(app)
injectJsInsert()
