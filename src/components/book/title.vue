<template>
  <transition name="slide-down">
    <div class="book-title" v-show="menuVisible">
      <div class="left">
        <i class="icon-back" @click="back"></i>
      </div>
      <div class="right">
        <i class="icon-shelf"></i>
        <i class="icon-cart"></i>
        <i class="icon-more"></i>
      </div>
    </div>
  </transition>
</template>


<script>
import { bookMixin } from "@/utils/mixin.js";
export default {
  mixins: [bookMixin],
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>


<style lang="scss">
@import "./../../assets/styles/global.scss";
.book-title {
  display: flex;
  font-size: px2rem(20);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 151;
  width: 100%;
  background: #fff;
  height: px2rem(45);
  box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, 0.1);
  .left {
    flex: 0 0 px2rem(50);
    @include center;
    font-size: px2rem(20);
  }
  .right {
    flex: 1;
    @include right;
    font-size: px2rem(24);
    padding: px2rem(10);
    i {
      padding-right: px2rem(8);
    }
    .icon-cart {
      padding-right: 0;
    }
  }
}
</style>