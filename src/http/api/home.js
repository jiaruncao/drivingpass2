import fly from "@/utils/request.js";
/*
 * author：Gengbaodada
 * create by date：2024/06/11
 * content：获取主题列表
 */
export function getThemeList(params) {
  return fly.post("/theme/getTheme", params, {
    Headers: {
      baseUrl: "VUE_APP_NEW_API_URL",
    },
  });
}
