import Vue from 'vue'
import Router from 'vue-router'
import {formatRoutes} from '@/utils/routerUtil'

Vue.use(Router)


// Route configurations that do not require login blocking
const loginIgnore = {
  names: ['404', '403'],      //Matches by route name
  paths: ['/login', '/redirect'],   //Matches based on route fullPath
  /**
   * Determines whether a route is included in the configuration
   * @param route vue-router blanco route objeto
   * @returns {boolean}
   */
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.path)
  }
}

/**
 * Initialize the routing instance
 * @param isAsync Whether the asynchronous routing pattern
 * @returns {VueRouter}
 */
function initRouter(isAsync) {
  const options = isAsync ? require('./async/config.async').default : require('./config').default
  formatRoutes(options.routes)
  return new Router(options)
}
export {loginIgnore, initRouter}
