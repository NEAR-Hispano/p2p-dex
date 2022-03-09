import Cookie from 'js-cookie'
// 401 interceptions
const resp401 = {
  /**
   * Do something before responding to the data
   * @param response The response object
   * @param options App configuration includes: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const {message} = options
    if (response.code === 401) {
      message.error('This permission is not available')
    }
    return response
  },
  /**
   * The response is executed when an error occurs
   * @param error The wrong object
   * @param options App configuration includes: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    const {response} = error
    if (response.status === 401) {
      message.error('This permission is not available')
    }
    return Promise.reject(error)
  }
}

const resp403 = {
  onFulfilled(response, options) {
    const {message} = options
    if (response.code === 403) {
      message.error('The request was denied')
    }
    return response
  },
  onRejected(error, options) {
    const {message} = options
    const {response} = error
    if (response.status === 403) {
      message.error('The request was denied')
    }
    return Promise.reject(error)
  }
}

const reqCommon = {
  /**
   * What to do before sending the request
   * @param config axios config
   * @param options App configuration includes: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    const {message} = options
    const {url, xsrfCookieName} = config
    if (url.indexOf('login') === -1 &&  xsrfCookieName && !Cookie.get(xsrfCookieName)) {
      message.warning('Authentication token has expired, please log back in')
    }
    return config
  },
  /**
   * Do something when a request goes wrong
   * @param error The wrong object
   * @param optionsApp configuration includes: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

export default {
  request: [reqCommon], // Request an intercept
  response: [resp401, resp403] // Respond to interception
}
