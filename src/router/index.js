import Vue from 'vue'
import VueRouter from 'vue-router'
import Welcome from "@/views/Welcome"
import Account from "@/views/Account";
import Login from "@/views/auth/Login";
import Register from "@/views/auth/Register";
import AuthMiddleware from '@/middleware/AuthMiddleware'
import Payment from "@/components/account/Payment/Payment";
import IsLoggedInMiddleware from "@/middleware/IsLoggedInMiddleware";

Vue.use(VueRouter)

  const routes = [
  {
    path: '',
    name: 'Welcome',
    beforeEnter: IsLoggedInMiddleware,
    component: Welcome,
  },
  {
    path: '/login',
    name: 'Login',
    beforeEnter: IsLoggedInMiddleware,
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    beforeEnter: IsLoggedInMiddleware,
    component: Register,
  },
  {
    path: '/account',
    name: 'Account',
    beforeEnter: AuthMiddleware,
    component: Account,
    children: [
      {
        path: 'payment',
        name: 'Payment',
        component: Payment,
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
