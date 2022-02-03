import TabsView from '@/layouts/tabs/TabsView'
import PageView from '@/layouts/PageView'

// Route configuration
const options = {
  
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/login')
    },
    {
      path: '/redirect',
      name: 'Redirect',
      component: () => import('@/pages/redirect')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: 'Home',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: '/dashboard/wallet',
          name: 'Wallet',
          meta: {
            icon: 'wallet'
          },
          component: () => import('@/pages/dashboard/wallet'),
        },
        {
          path: '/dashboard/p2p',
          name: 'p2p',
          meta: {
            icon: 'usergroup-add'
          },
          component: () => import('@/pages/form/p2p'),
        },
        {
          path: 'form',
          meta: {
            invisible: true,
          },
          component: PageView,
          children: [
            {
              path: '/dashboard/send',
              name: '基础表单',
              component: () => import('@/pages/form/send'),
            },
          ]
        },
        {
          path: '/dashboard/account',
          name: 'account',
          meta: {
            icon: 'user'
          },
          component: () => import('@/pages/form/account'),
        },
        {
          path: 'Settings',
          name: 'Settings',
          meta: {
            icon: 'setting',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'basic',
              name: '基础表单',
              component: () => import('@/pages/form/basic'),
            },
            {
              path: 'step',
              name: '分步表单',
              component: () => import('@/pages/form/step'),
            },
            {
              path: 'advance',
              name: '高级表单',
              component: () => import('@/pages/form/advance'),
            }
          ]
        },
      ],
    },
  ]
}

export default options
