import { createApp } from 'vue'
import App from './views/app.vue'
import 'ant-design-vue/dist/antd.css'
import i18n from '@/utils/i18n'

createApp(App).use(i18n).mount('#app')
