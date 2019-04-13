import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import i18n from '@/lang/index.js'; //国际化
import './assets/styles/icon.css'
import './assets/styles/reset.scss'
import './assets/styles/global.scss'
import './utils/createApi';
// import './mock/index.js';
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
