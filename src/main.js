import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: `${process.env.VUE_APP_BASE ? `${process.env.VUE_APP_BASE}` : ''}/api`,
  withCredentials: true,
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  }
});

Vue.prototype.$http = axiosInstance;

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
