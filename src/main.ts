import { createApp } from 'vue'
import App from './App.vue'
import piniaStore from './store'
import router from './router'
import './index.css'
import ArcoVue from "@arco-design/web-vue"
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import 'vue3-video-play/dist/style.css';
import loadingDirective from './packages/Loading/index'
// import vue3videoPlay from 'vue3-video-play' // 引入组件
// import 'vue3-video-play/dist/style.css' // 引入css
// 支持SVG
import 'virtual:svg-icons-register'
createApp(App)
  .use(piniaStore)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(router)
  .directive('loading', loadingDirective)
  .mount('#app')
