<template>
  <div class="store">
    <router-view></router-view>
    <store-home></store-home>
  </div>
</template>


<script>
import StoreHome from '@/components/bookstore/storehome.vue';
export default {
  components:{
    StoreHome
  },
}
</script>


<style lang="scss">
  .store{
    width: 100%;
    height: 100%;
    background: #fff;
  }
</style>