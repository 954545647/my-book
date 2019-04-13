import CreateAPI from 'vue-create-api'
import Vue from 'vue';

Vue.use(CreateAPI);

import Toast from '@/components/Common/toast.vue';
import Popup from '@/components/Common/popup.vue';
// createAPI 方法的第一个参数是组件的名称 name!!!
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)

Vue.mixin({
  methods:{
    toast(setting){
      return this.$createToast({
        $props: setting
      })
    },
    simpleToast(text){
      return this.toast({text:text})
    }
  }
})