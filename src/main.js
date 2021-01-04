import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './http/http.js'
import './assets/css/global.css'
import './assets/css/normalize.css'
import './plugins/element.js'

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
