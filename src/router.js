import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/store/home'
    },
    {
      path: "/ebook",
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
          path:'home',
          component:()=> import('./components/bookstore/storehome.vue')
        },
        {
          path: 'list',
          component:()=> import('./components/bookstore/StoreList.vue')
        },
        {
          path: 'detail',
          component:()=> import('./components/bookstore/StoreDetail.vue')
        },
        {
          path: 'shelf',
          component:()=> import('./components/bookstore/shelf.vue')
        }
      ]
    }
  ]
});
