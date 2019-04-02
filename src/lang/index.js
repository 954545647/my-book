import VueI18n from "vue-i18n";
import Vue from "vue";
import cn from "./cn.js"; // 中文资料
import en from "./en.js";
import { getLocale, setLocale } from "@/utils/localStorage.js";
Vue.use(VueI18n);

// 本地翻译信息
const messages = {
  cn,
  en
};

let locale = getLocale();
if (!locale) {
  locale = "cn";
  setLocale(locale);
}
// 初始化一个 VueI18n对象
const i18n = new VueI18n({
  locale, //初始化语言
  messages
});
export default i18n;