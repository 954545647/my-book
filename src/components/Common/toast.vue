<template>
  <transition name="fade">
    <div class="toast-bg" v-show="visiable">
      <div class="toast-wrapper">
        <div class="toast" v-html="text"></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name:'Toast',
  props: {
    text: {
      type: [String, Number],
      default: ""
    },
    timeout: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      visiable: false
    };
  },
  methods: {
    hide() {
      this.visiable = false;
    },
    show() {
      clearTimeout(this.task);
      this.task = null;
      this.visiable = true;
      this.task = setTimeout(() => {
        this.visiable = false;
      }, this.timeout);
    },
    continueShow() {
      clearTimeout(this.task);
      this.task = null;
      this.visiable = true;
    }
  }
};
</script>

<style lang="scss"  scoped>
  @import "@/assets/styles/global.scss";

  .toast-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 2500;
    width: 100%;
    @include center;
    .toast-wrapper {
      width: 60%;
      line-height: px2rem(20);
      padding: px2rem(10) px2rem(20);
      box-sizing: border-box;
      background: #ccc;
      border-radius: px2rem(10);
      font-size: px2rem(14);
      color: white;
      .toast {
        text-align: center;
        word-break: break-all;
      }
    }
  }
</style>

