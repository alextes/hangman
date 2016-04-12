import Vue from 'vue'
import App from './App.vue'
import VueMdl from 'vue-mdl'
Vue.use(VueMdl)

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App },
  config: {
    debug: true,
  },
})
