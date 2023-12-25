import Home from '@/container/Home'
import Data from '@/container/Data'
import User from '@/container/User'
import Login from '@/container/Login'
import Detail from '@/container/Detail'
import Userinfo from '@/container/Userinfo'

const routes = [
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/data',
    component: Data,
  },
  {
    path: '/user',
    component: User,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/detail',
    component: Detail,
  },
  {
    path: '/userinfo',
    component: Userinfo,
  },
]

export default routes
