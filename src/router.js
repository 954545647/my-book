import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/book"
    },
    {
      path: "/book",
      component: () => import("./views/book/index.vue"),
      children:[
        {
          path: ':fileName',
          component: ()=> import('@/components/book/reader.vue')
        }
      ]
    }
  ]
});
