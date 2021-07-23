import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Activity from '../views/Activity.vue'
import Post from '../views/AnswerComment.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Login
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/Signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/Activity',
    name: 'Activity',
    component: Activity
  },
  {
    path: '/Post/:id',
    name: 'Post',
    component: Post
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
