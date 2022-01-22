export default {
  namespaced: true,
  state: {
    user: undefined,
    userInfo: undefined,
    userInfoLastLogin: undefined,
    userAvatar: undefined,
    permissions: null,
    roles: null,
    routesConfig: null
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          const user = localStorage.getItem(process.env.VUE_APP_USER_KEY)
          state.user = JSON.parse(user)
        } catch (e) {
          console.error(e)
        }
      }
      return state.user
    },
    userInfo: state => {
      if (!state.userinfo) {
        try {
          const userinfo = localStorage.getItem(process.env.VUE_APP_USER_INFO)
          state.userinfo = JSON.parse(userinfo)
        } catch (e) {
          console.error(e)
        }
      }
      return state.userinfo
    },
    userInfoLastLogin: state => {
      if (!state.lastlogin) {
        try {
          const lastlogin = localStorage.getItem(process.env.VUE_APP_USER_LAST_LOGIN)
          state.lastlogin = JSON.parse(lastlogin)
        } catch (e) {
          console.error(e)
        }
      }
      return state.lastlogin
    },
    userAvatar: state => {
      if (!state.userAvatar) {
        try {
          const userAvatar = localStorage.getItem(process.env.VUE_APP_USER_AVATAR)
          state.userAvatar = JSON.parse(userAvatar)
        } catch (e) {
          console.error(e)
        }
      }
      return state.userAvatar
    },
    permissions: state => {
      if (!state.permissions) {
        try {
          const permissions = localStorage.getItem(process.env.VUE_APP_PERMISSIONS_KEY)
          state.permissions = JSON.parse(permissions)
          state.permissions = state.permissions ? state.permissions : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.permissions
    },
    roles: state => {
      if (!state.roles) {
        try {
          const roles = localStorage.getItem(process.env.VUE_APP_ROLES_KEY)
          state.roles = JSON.parse(roles)
          state.roles = state.roles ? state.roles : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.roles
    },
    routesConfig: state => {
      if (!state.routesConfig) {
        try {
          const routesConfig = localStorage.getItem(process.env.VUE_APP_ROUTES_KEY)
          state.routesConfig = JSON.parse(routesConfig)
          state.routesConfig = state.routesConfig ? state.routesConfig : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.routesConfig
    },
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(user))
    },
    setPermissions(state, permissions) {
      state.permissions = permissions
      localStorage.setItem(process.env.VUE_APP_PERMISSIONS_KEY, JSON.stringify(permissions))
    },
    setRoles(state, roles) {
      state.roles = roles
      localStorage.setItem(process.env.VUE_APP_ROLES_KEY, JSON.stringify(roles))
    },
    setRoutesConfig(state, routesConfig) {
      state.routesConfig = routesConfig
      localStorage.setItem(process.env.VUE_APP_ROUTES_KEY, JSON.stringify(routesConfig))
    },
    setUserInfo(state, userinfo) {
      state.userinfo = userinfo
      localStorage.setItem(process.env.VUE_APP_USER_INFO, JSON.stringify(userinfo))
    },
    setUserInfoLastLogin(state, lastlogin) {
      state.lastlogin = lastlogin
      localStorage.setItem(process.env.VUE_APP_USER_LAST_LOGIN, JSON.stringify(lastlogin))
    },
    setUserAvatar(state, userAvatar) {
      state.userAvatar = userAvatar
      localStorage.setItem(process.env.VUE_APP_USER_AVATAR, JSON.stringify(userAvatar))
    },
  }
}
