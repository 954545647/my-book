import Vue from "vue";
import Vuex from "vuex";
import book from "./modules/book";
import getters from "./getters";
import actions from "./actions.js";
Vue.use(Vuex);

export default new Vuex.Store({
  // 模块化
  modules: {
    book
  },
  actions,
  getters,
});
