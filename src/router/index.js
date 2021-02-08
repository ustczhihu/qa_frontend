import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Content from '../views/Content.vue'
import PublishQuestion from '../views/PublishQuestion.vue'
import PublishAnswer from '../views/PublishAnswer.vue'
import AnswerDetail from '../views/AnswerDetail.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import Profile from '../views/Profile.vue'
import EditAnswer from '../views/EditAnswer.vue'
import EditQuestion from '../views/EditQuestion.vue'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/question/:id',
    name: 'Content',
    component: Content
  },
  {
    path: '/publishquestion',
    name: 'PublishQuestion',
    component: PublishQuestion,
    meta: { requireAuth: true }
  },
  {
    path: '/publishanswer',
    name: 'PublishAnswer',
    component: PublishAnswer,
    meta: { requireAuth: true }
  },
  {
    path: '/editquestion',
    name: 'EditQuestion',
    component: EditQuestion,
    meta: { requireAuth: true }
  },
  {
    path: '/editanswer',
    name: 'EditAnswer',
    component: EditAnswer,
    meta: { requireAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requireAuth: true }
  },
  {
    path: '/answerdetail',
    name: 'AnswerDetail',
    component: AnswerDetail,
    meta: { requireAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
