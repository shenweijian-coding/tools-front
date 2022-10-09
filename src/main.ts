import { createApp } from 'vue'
import App from './App.vue'
import piniaStore from './store'
import router from './router'
import './index.css'
import ArcoVue from "@arco-design/web-vue"
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import loadingDirective from './packages/Loading/index'
// 支持SVG
import 'virtual:svg-icons-register'
createApp(App)
  .use(piniaStore)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(router)
  .directive('loading', loadingDirective)
  .mount('#app')
