import Vue from 'vue'
import VueRouter from 'vue-router'
import Welcome from "@/views/Welcome"
import AuthMiddleware from '@/middleware/AuthMiddleware'
import Login from "@/views/auth/Login";
import Register from "@/views/auth/Register";
import Account from "@/views/Account";
import Payment from "@/components/account/Payment";
import PaymentSuccess from "@/components/account/PaymentSuccess";

Vue.use(VueRouter)

  const routes = [
  {
    path: '',
    name: 'Welcome',
    component: Welcome,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
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
        component: Payment
      },
      {
        path: 'payment-success',
        name: 'PaymentSuccess',
        component: PaymentSuccess
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
