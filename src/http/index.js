// 导入业务页面所有接口方法
import * as home from "./api/home.js";
import * as index from "./api/index.js";
import * as login from "./api/login.js";
import * as community from "./api/community.js";
import Vue from "vue";

export const STATUS_OK = "000";
const api = {
  STATUS_OK: STATUS_OK,
  ...home,
  ...index,
  ...login,
  ...community,
};
// vue原型挂载api请求对象
Vue.prototype.$http = api;
//导出请求对象 api
export default api;
