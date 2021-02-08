import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultLoginResult = {
  token: null,
  nickname: null,
  gender: null,
  desc: null,
  avatarUrl: null,
  userId: null
}

export default new Vuex.Store({
  state: {
    isLogin: false,
    loginResult: defaultLoginResult
  },
  mutations: {
    init(state) {
      let loginResult = JSON.parse(localStorage.getItem('loginResult'))
      //console.log(localStorage.getItem("loginResult"));
      if (loginResult != null) {
        state.loginResult = loginResult
      }
    },
    login(state, loginResult) {
      state.loginResult = loginResult
    },
    logout(state) {
      localStorage.removeItem('loginResult')
      state.loginResult = defaultLoginResult
    }
  },
  actions: {},
  getters: {
    isLogin: state => state.loginResult.userId !== null,
    userID: state => state.loginResult.userId,
    nickname: state => state.loginResult.nickname,
    gender: state => state.loginResult.gender,
    avatarUrl: state => state.loginResult.avatarUrl,
    desc: state => state.loginResult.desc,
    accessToken: state => state.loginResult.token
  }
})
