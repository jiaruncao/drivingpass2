/*
 * author：Gengbaodada
 * create by date：2024/11/11
 * content：首页接口统一管理
 */
import fly from "@/utils/request.js";

/*
 * author：Gengbaodada
 * create by date：2024/06/11
 * content：获取banner
 */
export function getIndexBanner(params) {
  return fly.get("mobile/platform?a=scroll_bar", params, {
    otherQuery: {
      baseUrl: "VUE_APP_NEW_API_URL",
    },
  });
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

/*
 * author：Gengbaodada
 * create by date：2024/11/11
 * content：获取首页救助案例
 */
export function getIndexAl(params) {
  return fly.post("index/proposers/getAnli", params, {
    otherQuery: {
      baseUrl: "VUE_APP_API_URL",
    },
  });
}

/*
 * author：Gengbaodada
 * create by date：2024/11/11
 * content：获取首页消息通知
 */
export function getIndexMessage(params) {
  return fly.get("/mobile/content?a=list", params, {
    otherQuery: {
      baseUrl: "VUE_APP_NEW_API_URL",
    },
  });
}

/*
 * author：Gengbaodada
 * create by date：2024/11/11
 * content：获取消息通知详情
 */
export function getIndexMessageInfo(params) {
  return fly.get("/mobile/content?a=content", params, {
    otherQuery: {
      baseUrl: "VUE_APP_NEW_API_URL",
    },
  });
}

/*
 * author：Gengbaodada
 * create by date：2025/07/28
 * content：分类查询
 */
export function getTypeFind(params) {
  return fly.post("/exam/subject/index", params);
}

/*
 * content：分类查询
 */
export function getCateThree(params) {
  return fly.post("/exam/cate/getThree", params);
}


/*
 * 查询全量题库
 */
export function queryAllQuestion(params) {
  return fly.post("/exam/question/queryAllQuestion", params);
}
