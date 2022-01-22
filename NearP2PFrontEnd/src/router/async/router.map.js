// View components
const view = {
  tabs: () => import("@/layouts/tabs"),
  blank: () => import("@/layouts/BlankView"),
  page: () => import("@/layouts/PageView")
};

// Route component registration
const routerMap = {
  login: {
    authority: "*",
    path: "/login",
    component: () => import("@/pages/login")
  },
  exp403: {
    authority: "*",
    name: "exp403",
    path: "403",
    component: () => import("@/pages/exception/403")
  },
  exp404: {
    name: "exp404",
    path: "404",
    component: () => import("@/pages/exception/404")
  },
  exp500: {
    name: "exp500",
    path: "500",
    component: () => import("@/pages/exception/500")
  },
  root: {
    path: "/",
    name: "Home",
    redirect: "/login",
    component: view.tabs
  },
};
export default routerMap;
