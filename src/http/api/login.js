/*
 * author：Gengbaodada
 * create by date：2024/11/11
 * content：登录相关接口统一管理
 */
import fly from "@/utils/request.js";

export function userLogin(params) {
  return fly.post("/exam/user/userLogin", params);
}

export function register(params) {
  return fly.post("/exam/user/register", params);
}

/*
 * author：Gengbaodada
 * create by date：2024/06/11
 * content：获取个人信息
 */
export function getUserInfo(params) {
  return fly.post("/exam/user/info", params);
}
/*
 * author：Gengbaodada
 * create by date：2024/08/18
 * content：修改个人信息
 */
export function saveInfo(params) {
  return fly.post("/exam/user/save", params);
}

/*
 * author：Gengbaodada
 * create by date：2024/11/11
 * content：获取首页菜单
 */
export function getIndexMenu(params) {
  return fly.get("mobile/users?a=menu", params, {
    otherQuery: {
      baseUrl: "VUE_APP_NEW_API_URL",
    },
  });
}
// 选择考试类型
export function choiceLicenseType(params) {
  return fly.post("/exam/user/choiceLicenseType", params);
}
// 设置开始时间
export function setTestDate(params) {
  return fly.post("/exam/user/setTestDate", params);
}

/*
 * author：huanyun
 * create by date：2024/11/11
 * content：获取会员配置
 */
export function getMemberOpenConfig(params) {
  return fly.post("/exam/user/memberOpenConfig", params);
}
/*
 * author：huanyun
 * create by date：2024/11/11
 * content：开通会员
 */
export function createMemberOrder(params) {
  return fly.post("/exam/user/createMemberOrder", params);
}
/*
 * author：huanyun
 * create by date：2024/11/11
 * content：查询会员信息
 */
export function queryMemberInfo(params) {
  return fly.post("/exam/user/queryMemberInfo", params);
}
/*
 * author：huanyun
 * create by date：2024/11/11
 * content：查询会员参数
 */
export function queryMemberConfig(params) {
  return fly.post("/exam/user/queryMemberConfig", params);
}
