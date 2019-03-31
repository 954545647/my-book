import Vue from "vue";
import Vuex from "vuex";
import book from './modules/book'
Vue.use(Vuex);

export default new Vuex.Store({
  // 模块化
  modules:{
    book
  },
  getters:{
    age: state=> state.book.age
  }
});
