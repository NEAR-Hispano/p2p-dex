import {loadRoutes, loadGuards, setAppOptions} from '@/utils/routerUtil'
import {loadInterceptors} from '@/utils/request'
import guards from '@/router/guards'
import interceptors from '@/utils/axios-interceptors'

/**
 * Start the boot method
 * Here's what you need to do when your app starts
 * @param router The route instance of the app
 * @param store The vuex.store instance of the app
 * @param i18n The vue-i18n instance of the app
 * @param i18n The message instance of the app
 */
function bootstrap({router, store, i18n, message}) {
  // Set up the app configuration
  setAppOptions({router, store, i18n})
  // Load the axios interceptor
  loadInterceptors(interceptors, {router, store, i18n, message})
  // Load the route
  loadRoutes()
  // Load the route guard
  loadGuards(guards, {router, store, i18n, message})
}

export default bootstrap
