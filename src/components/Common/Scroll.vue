<template>
  <div class="scroll-wrapper" @scroll.passive="handleScroll" ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script>
import { realPx } from "@/utils/utils.js";
export default {
  props: {
    //   滚动条上方占据的高度
    top: {
      default: 0,
      type: Number
    },
    bottom: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleScroll(e) {
      let offsetY =
        e.target.scrollTop || window.pageYOffset || document.body.scrollTop;
      this.$emit("onScroll", offsetY);
    },
    refresh() {
      if (this.$refs.scrollWrapper) {
        this.$refs.scrollWrapper.style.height =
          window.innerHeight - realPx(this.top) - realPx(this.bottom) + "px";
        this.$refs.scrollWrapper.addEventListener("scroll", this.handleScroll);
      }
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>


<style lang="scss">
@import "@/assets/styles/global.scss";
.scroll-wrapper {
  position: relative;
  z-index: 100;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  // 针对移动端的卡顿问题
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  &.no-scroll {
    overflow: hidden;
  }
}
</style>
