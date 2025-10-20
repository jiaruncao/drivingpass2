import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const messages = {
  en: {
    message: {
      hello: "Hello World",
    },
  },
  zh: {
    message: {
      hello: "你好，世界",
    },
  },
};

const i18n = new VueI18n({
  locale: "en", // 默认语言
  messages, // 语言包
});

export default i18n;
