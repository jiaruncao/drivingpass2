import Vue from "vue";
import App from "./App";
import "./uni.promisify.adaptor";
import store from "./store";
import utils from "@/utils/index";
import uView from "uview-ui";
import "./http/index.js";
import i18n from "./i18n/i18n.js";
import safeAreaMixin from "../public/js/safeAreaMixin";
import voice from "./js_sdk/wjd-audioplayer/voice.js";
Vue.config.productionTip = false;
Vue.config.productionTip = false;
Vue.mixin(safeAreaMixin);
Vue.use(uView);

/*
 * author：Gengbaodada
 * create by date：2024/11/11
 * content：全局挂在公共函数
 */
Vue.prototype.$utils = utils;
Vue.prototype.$voice = voice;
App.mpType = "app";

const app = new Vue({
  ...App,
  /*
   * author：Gengbaodada
   * create by date：2024/11/11
   * content：注册vuex
   */
  store,
  i18n,
});
app.$mount();
