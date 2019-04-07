<template>
  <div class="ebook-footer">
    <div class="ebook-footer-text">{{this.progress}}%</div>
  </div>
</template>


<script>
import { bookMixin } from "@/utils/mixin.js";

export default {
  mixins: [bookMixin]
};
</script>
<style lang="scss">
@import "../../assets/styles/global.scss";
.ebook-footer{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  .ebook-footer-text{
    font-size: px2rem(14);
    @include right;
    color: #7d7d7d;
  padding: 0 px2rem(10) px2rem(10) 0;
  }
}
</style>