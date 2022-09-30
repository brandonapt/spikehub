import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://'+process.env.VUE_APP_BASE+'/api',
  withCredentials: true
});

Vue.prototype.$http = axiosInstance;

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
