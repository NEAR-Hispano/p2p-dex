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
    /*Trade Detail*/
    {
      path: '/d',
      component: TabsView,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: BlankView,
        },
        {
          path: 'trade',
          name: 'trade',
          component: BlankView,
          children: [
            {
              path: 'detail',
              name: 'detail',
              component: () => import('@/pages/detail/AdvancedDetail'),
            },
          ]
        },
      ]
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
            {
              path: 'analysis',
              name: 'Analyze the page',
              meta: {
                icon: 'dashboard',
              },
              component: () => import('@/pages/dashboard/analysis'),
            }
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
              path: 'offer',
              name: 'offer',
              meta: {
                icon: 'user-add',
              },
              component: () => import('@/pages/form/account'),
            },
          ]
        },
      ]
    },
  ]
}

export default options
