<template>
  <header class="header">
    <span class="logo" @click="goIndex">USTC-QA</span>

    <div class="btns">
      <div v-show="!isLogin">
        <a class="login-btn" @click="goLogin">登录</a>
        <a class="login-btn" @click="goSignUp">注册</a>
      </div>
      <div class="user-box" v-show="isLogin">
        <span class="user">{{ currUsername }}</span>
        <div class="dropdown-content">
          <a @click="goProfile">个人中心</a>
          <a @click="goLogout">登出</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeadBar',
  created() {
    this.$store.commit('init')
  },
  computed: {
    isLogin() {
      return this.$store.getters.isLogin
    },
    currUsername() {
      return this.$store.getters.nickname
    },
  },
  methods: {
    goIndex() {
      this.$router.push({ name: 'Home' })
    },
    goLogin() {
      this.$router.push({ name: 'Login' })
    },

    goSignUp() {
      this.$router.push({ name: 'SignUp' })
    },
    goLogout() {
      this.$store.commit('logout')
    },
    goProfile() {
      this.$router.push({ name: 'Profile' })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.header {
  width: 100%;
  height: 48px;
  position: fixed;
  background: #ffffff;
  align-items: center;
  top: 0;
  z-index: 1;
  .logo {
    float: left;
    margin-left: 10px;
    height: 48px;
    background: url('../assets/images/logo.png') no-repeat;
    background-size: 32px 32px;
    background-position: left center;
    padding-left: 35px;
    line-height: 48px;
    margin-right: 16px;
    cursor: pointer;
  }

  .btns {
    float: right;
    line-height: 48px;
    .login-btn {
      border: 1px solid transparent;
      border-radius: 4px;
      box-sizing: border-box;
      text-align: center;
      letter-spacing: 1px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      line-height: 24px;
      text-transform: uppercase;
      padding: 3px 16px;
      border-color: #0079d3;
      color: #0079d3;
      fill: #0079d3;
      display: inline-block;

      cursor: pointer;
      &:nth-child(1) {
        margin-right: 5px;
      }
      &:nth-child(2) {
        margin-right: 10px;
      }
    }
    .user {
      width: auto;
      height: 24px;
      background: url('../assets/images/avatar.png') no-repeat;
      background-size: 24px 24px;
      background-position: left center;
      padding-left: 28px;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      cursor: pointer;
      padding: 12px 12px 12px 28px;
      &::after {
        content: '';
        width: 0;
        height: 0;
        border-top: 5px solid #878a8c;
        border-right: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid transparent;
        margin-top: 5px;
        margin-left: 10px;
      }
    }
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        cursor: pointer;
      }
      a:hover {
        background-color: #f1f1f1;
      }
    }
    .user-box:hover .dropdown-content {
      display: block;
    }
  }
}
</style>
