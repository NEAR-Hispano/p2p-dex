import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'

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
    
    /*General Menu*/
    {
      path: '/',
      name: 'Home',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'wallet',
              name: 'wallet',            
              meta: {
                icon: 'wallet',
                page: {
                  closable: false
                }
              },
              component: () => import('@/pages/dashboard/wallet'),
            },
            /*
            {
              path: 'analysis',
              name: 'Analyze the page',
              meta: {
                icon: 'dashboard',
              },
              component: () => import('@/pages/dashboard/analysis'),
            }*/
          ]
        },
        {
          path: 'trade',
          name: 'trade',
          meta: {
            icon: 'usergroup-add',
            page: {
              cacheAble: false
            }
          },
          component: BlankView,
          children: [
            {
              path: 'p2p',
              name: 'p2p',
              meta: {
                icon: 'usergroup-add',
              },
              component: () => import('@/pages/form/p2p'),
            },
            {
              path: 'p2pdetail',
              name: 'p2pdetail',
              meta: {
                icon: 'unordered-list',
              },
              component: () => import('@/pages/form/p2porders'),
            },
            {
              path: 'tradedetail',
              name: 'tradedetail',
              meta: {
                icon: 'folder-open',
              },
              component: () => import('@/pages/detail/AdvancedDetail'),
            },
            {
              path: 'offer',
              name: 'offer',
              meta: {
                icon: 'user-add',
              },
              component: () => import('@/pages/form/placeoffer'),
            },
            {
              path: 'merchant',
              name: 'merchant',
              meta: {
                icon: 'audit',
              },
              component: () => import('@/pages/form/merchants'),
            },
          ]
        },
        {
          path: 'account',
          name: 'account',
          meta: {
            icon: 'setting',
            page: {
              cacheAble: false
            }
          },
          component: BlankView,
          children: [
            {
              path: 'myaccount',
              name: 'myaccount',
              meta: {
                icon: 'user',
              },
              component: () => import('@/pages/form/account'),
            },
            {
              path: 'bank',
              name: 'bank',
              meta: {
                icon: 'bank',
              },
              component: () => import('@/pages/form/bank'),
            },
            {
              path: 'history',
              name: 'history',
              meta: {
                icon: 'unordered-list',
              },
              component: () => import('@/pages/form/history'),
            },
          ]
        },
      ]
    },
  ]
}

export default options
