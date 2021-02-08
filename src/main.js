import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './service/api'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
import {
  Message,
  ButtonGroup,
  Button,
  MessageBox,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Form,
  FormItem,
  Dialog,
  Upload
} from 'element-ui'
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Dialog)
Vue.use(Upload)
Vue.prototype.$axios = axios
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (localStorage.getItem('loginResult')) {
      //判断本地是否存在access_token
      next()
    } else {
      if (to.path === '/login') {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    }
  } else {
    next()
  }
  /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
  if (to.fullPath == '/login') {
    if (localStorage.getItem('loginResult')) {
      next({
        path: from.fullPath
      })
    } else {
      next()
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
