import routerMap from './router.map'
import {parseRoutes} from '@/utils/routerUtil'

// Asynchronous routing configuration
const routesConfig = [
  'login',
  'passwordreset',
  'passwordset',
  'root',
  {
    router: 'exp404',
    path: '*',
    name: '404'
  },
  {
    router: 'exp403',
    path: '/403',
    name: '403'
  },
]

const options = {
  routes: parseRoutes(routesConfig, routerMap)
}

export default options
