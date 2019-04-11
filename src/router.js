import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/store"
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
    },
    {
      path:'/store',
      component:()=> import('./views/bookstore/index.vue'),
      children:[
        {
          path:':bookname',
          component:()=> import('./components/bookstore/storehome.vue')
        }
      ]
    }
  ]
});
