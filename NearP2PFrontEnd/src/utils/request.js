import axios from "axios";
import Cookie from "js-cookie";

//Cross-domain authentication information header name
const xsrfHeaderName = "Authorization";
// const xsrfHeaderName = "token ";

axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = xsrfHeaderName;
axios.defaults.xsrfCookieName = xsrfHeaderName;

// The type of certification
const AUTH_TYPE = {
  BEARER: "Bearer",
  BASIC: "basic",
  AUTH1: "auth1",
  AUTH2: "auth2",
  TOKEN: "token"
};

// http method
const METHOD = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete"
};

/**
 * axios request
 * @param url The request address
 * @param method {METHOD} http method
 * @param params Request parameters
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params, config) {
  switch (method) {
    case METHOD.GET:
      return axios.get(url, { params, ...config });
    case METHOD.POST:
      return axios.post(url, params, config);
    case METHOD.PUT:
      return axios.put(url, params, config);
    case METHOD.DELETE:
      return axios.delete(url, { params, ...config });
    default:
      return axios.get(url, { params, ...config });
  }
}

/**
 * Set up certification information
 * @param auth {Object}
 * @param authType {AUTH_TYPE} Certification type, default：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth, authType = AUTH_TYPE.TOKEN) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookie.set(xsrfHeaderName, "Bearer " + auth.token, {
        expires: auth.expireAt
      });
      break;
    case AUTH_TYPE.TOKEN:
      Cookie.set(xsrfHeaderName, "token " + auth.token, {
        expires: auth.expireAt
      });
      break;
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
}

/**
 * Remove the authentication information
 * @param authType {AUTH_TYPE} The type of certification
 */
function removeAuthorization(authType = AUTH_TYPE.TOKEN) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookie.remove(xsrfHeaderName);
      break;
    case AUTH_TYPE.TOKEN:
      Cookie.remove(xsrfHeaderName);
      break;
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
}

/**
 * Check the certification information
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.TOKEN) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      if (Cookie.get(xsrfHeaderName)) {
        return true;
      }
      break;
    case AUTH_TYPE.TOKEN:
      if (Cookie.get(xsrfHeaderName)) {
        return true;
      }
      break;
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
  return false;
}

/**
 * Load the axios interceptor
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
  const { request, response } = interceptors;
  // Load the request interceptor
  request.forEach(item => {
    let { onFulfilled, onRejected } = item;
    if (!onFulfilled || typeof onFulfilled !== "function") {
      onFulfilled = config => config;
    }
    if (!onRejected || typeof onRejected !== "function") {
      onRejected = error => Promise.reject(error);
    }
    axios.interceptors.request.use(
      config => onFulfilled(config, options),
      error => onRejected(error, options)
    );
  });
  // Load the response interceptor
  response.forEach(item => {
    let { onFulfilled, onRejected } = item;
    if (!onFulfilled || typeof onFulfilled !== "function") {
      onFulfilled = response => response;
    }
    if (!onRejected || typeof onRejected !== "function") {
      onRejected = error => Promise.reject(error);
    }
    axios.interceptors.response.use(
      response => onFulfilled(response, options),
      error => onRejected(error, options)
    );
  });
}

/**
 * parse url The argument in
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url) {
  const params = {};
  if (!url || url === "" || typeof url !== "string") {
    return params;
  }
  const paramsStr = url.split("?")[1];
  if (!paramsStr) {
    return params;
  }
  const paramsArr = paramsStr.replace(/&|=/g, " ").split(" ");
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1];
    params[paramsArr[i * 2]] =
      value === "true" ? true : value === "false" ? false : value;
  }
  return params;
}

export {
  METHOD,
  AUTH_TYPE,
  request,
  setAuthorization,
  removeAuthorization,
  checkAuthorization,
  loadInterceptors,
  parseUrlParams
};
