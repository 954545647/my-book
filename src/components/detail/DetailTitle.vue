<template>
  <div class="detail-title-wrapper">
    <div class="icon-left-wrapper">
      <i class="icon-back" @click="back()"></i>
    </div>
    <div class="icon-right-wrapper">
      <i class="icon-shelf"></i>
    </div>
  </div>
</template>

<script>
export default {
  methods:{
    back(){
      this.$router.go(-1);
    },
    showShadow(){

    },
    hideShadow(){
      
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
.detail-title-wrapper{
  position: relative;
  left: 0;
  top: 0;
  height: px2rem(40);
  display: flex;
  width: 100%;
  padding: px2rem(15) px2rem(15);
  box-sizing: border-box;
  font-size: px2rem(20);
  .icon-left-wrapper{
    flex: 1;
    display: flex;
    justify-content: flex-start;
  }
  .icon-right-wrapper{
    flex:1;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
