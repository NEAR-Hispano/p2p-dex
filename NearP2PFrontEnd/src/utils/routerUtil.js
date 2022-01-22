import routerMap from '@/router/async/router.map'
import {mergeI18nFromRoutes} from '@/utils/i18n'
import Router from 'vue-router'
import deepMerge from 'deepmerge'
import basicOptions from '@/router/async/config.async'

//App configuration
let appOptions = {
  router: undefined,
  i18n: undefined,
  store: undefined
}

/**
 * Set up the app configuration
 * @param options
 */
function setAppOptions(options) {
  const {router, store, i18n} = options
  appOptions.router = router
  appOptions.store = store
  appOptions.i18n = i18n
}

/**
 * Resolve routes based on route configuration and route component registration
 * @param routesConfig Route configuration
 * @param routerMap The local routing component registers the configuration
 */
function parseRoutes(routesConfig, routerMap) {
  let routes = []
  routesConfig.forEach(item => {
    // Get the router registered in routerMap and initialize routeCfg
    let router = undefined, routeCfg = {}
    if (typeof item === 'string') {
      router = routerMap[item]
      routeCfg = {path: (router && router.path) || item, router: item}
    } else if (typeof item === 'object') {
      router = routerMap[item.router]
      routeCfg = item
    }
    if (!router) {
      console.warn(`can't find register for router ${routeCfg.router}, please register it in advance.`)
      router = typeof item === 'string' ? {path: item, name: item} : item
    }
    // Resolve routes from router and routeCfg
    const meta = {
      authority: router.authority,
      icon: router.icon,
      page: router.page,
      link: router.link,
      params: router.params,
      query: router.query,
      ...router.meta
    }
    const cfgMeta = {
      authority: routeCfg.authority,
      icon: routeCfg.icon,
      page: routeCfg.page,
      link: routeCfg.link,
      params: routeCfg.params,
      query: routeCfg.query,
      ...routeCfg.meta
    }
    Object.keys(cfgMeta).forEach(key => {
      if (cfgMeta[key] === undefined || cfgMeta[key] === null || cfgMeta[key] === '') {
        delete cfgMeta[key]
      }
    })
    Object.assign(meta, cfgMeta)
    const route = {
      path: routeCfg.path || router.path || routeCfg.router,
      name: routeCfg.name || router.name,
      component: router.component,
      redirect: routeCfg.redirect || router.redirect,
      meta: {...meta, authority: meta.authority || '*'}
    }
    if (routeCfg.invisible || router.invisible) {
      route.meta.invisible = true
    }
    if (routeCfg.children && routeCfg.children.length > 0) {
      route.children = parseRoutes(routeCfg.children, routerMap)
    }
    routes.push(route)
  })
  return routes
}

/**
 * Load the route
 * @param routesConfig {RouteConfig[]} Route configuration
 */
function loadRoutes(routesConfig) {
  //Compatible with the following versions of 0.6.1
  /*************** compatible version < v0.6.1 *****************/
  if (arguments.length > 0) {
    const arg0 = arguments[0]
    if (arg0.router || arg0.i18n || arg0.store) {
      routesConfig = arguments[1]
      console.error('the usage of signature loadRoutes({router, store, i18n}, routesConfig) is out of date, please use the new signature: loadRoutes(routesConfig).')
      console.error('Method signature loadRoutes({router, store, i18n}, routesConfig) The usage of is out of date, sign with a new method loadRoutes(routesConfig)。')
    }
  }
  /*************** compatible version < v0.6.1 *****************/

  // App configuration
  const {router, store, i18n} = appOptions

  // If routesConfig has a value, it is updated to local, otherwise it is obtained locally
  if (routesConfig) {
    store.commit('account/setRoutesConfig', routesConfig)
  } else {
    routesConfig = store.getters['account/routesConfig']
  }
  // If asynchronous routing is turned on, the asynchronous routing configuration is loaded
  const asyncRoutes = store.state.setting.asyncRoutes
  if (asyncRoutes) {
    if (routesConfig && routesConfig.length > 0) {
      const routes = parseRoutes(routesConfig, routerMap)
      const finalRoutes = mergeRoutes(basicOptions.routes, routes)
      formatRoutes(finalRoutes)
      router.options = {...router.options, routes: finalRoutes}
      router.matcher = new Router({...router.options, routes:[]}).matcher
      router.addRoutes(finalRoutes)
    }
  }
  // Extract routing internationalization data
  mergeI18nFromRoutes(i18n, router.options.routes)
  // Initialize the Admin background menu data
  const rootRoute = router.options.routes.find(item => item.path === '/')
  const menuRoutes = rootRoute && rootRoute.children
  if (menuRoutes) {
    store.commit('setting/setMenuData', menuRoutes)
  }
}

/**
 * Merge routes
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function mergeRoutes(target, source) {
  const routesMap = {}
  target.forEach(item => routesMap[item.path] = item)
  source.forEach(item => routesMap[item.path] = item)
  return Object.values(routesMap)
}

/**
 * Deep merge routes
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function deepMergeRoutes(target, source) {
  // Map the route array
  const mapRoutes = routes => {
    const routesMap = {}
    routes.forEach(item => {
      routesMap[item.path] = {
        ...item,
        children: item.children ? mapRoutes(item.children) : undefined
      }
    })
    return routesMap
  }
  const tarMap = mapRoutes(target)
  const srcMap = mapRoutes(source)

  // Merge routes
  const merge = deepMerge(tarMap, srcMap)

  // Convert to a routes array
  const parseRoutesMap = routesMap => {
    return Object.values(routesMap).map(item => {
      if (item.children) {
        item.children = parseRoutesMap(item.children)
      } else {
        delete item.children
      }
      return item
    })
  }
  return parseRoutesMap(merge)
}

/**
 * Format the route
 * @param routes Route configuration
 */
function formatRoutes(routes) {
  routes.forEach(route => {
    const {path} = route
    if (!path.startsWith('/') && path !== '*') {
      route.path = '/' + path
    }
  })
  formatAuthority(routes)
}

/**
 * Format the permission configuration for the route
 * @param routes routing
 * @param pAuthorities The parent routing permission configuration collection
 */
function formatAuthority(routes, pAuthorities = []) {
  routes.forEach(route => {
    const meta = route.meta
    const defaultAuthority = pAuthorities[pAuthorities.length - 1] || {permission: '*'}
    if (meta) {
      let authority = {}
      if (!meta.authority) {
        authority = defaultAuthority
      }else if (typeof meta.authority === 'string') {
        authority.permission = meta.authority
      } else if (typeof meta.authority === 'object') {
        authority = meta.authority
        const {role} = authority
        if (typeof role === 'string') {
          authority.role = [role]
        }
        if (!authority.permission && !authority.role) {
          authority = defaultAuthority
        }
      }
      meta.authority = authority
    } else {
      const authority = defaultAuthority
      route.meta = {authority}
    }
    route.meta.pAuthorities = pAuthorities
    if (route.children) {
      formatAuthority(route.children, [...pAuthorities, route.meta.authority])
    }
  })
}

/**
 * Resolve i18n key from route path
 * @param path
 * @returns {*}
 */
function getI18nKey(path) {
  const keys = path.split('/').filter(item => !item.startsWith(':') && item != '')
  keys.push('name')
  return keys.join('.')
}

/**
 * Load the navigation guard
 * @param guards
 * @param options
 */
function loadGuards(guards, options) {
  const {beforeEach, afterEach} = guards
  const {router} = options
  beforeEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.beforeEach((to, from, next) => guard(to, from, next, options))
    }
  })
  afterEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.afterEach((to, from) => guard(to, from, options))
    }
  })
}

export {parseRoutes, loadRoutes, formatAuthority, getI18nKey, loadGuards, deepMergeRoutes, formatRoutes, setAppOptions}
