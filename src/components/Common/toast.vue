<template>
  <transition name="fade">
    <div class="toast-bg-wrapper" @click.prevent v-show="visiable">
      <div class="toast-bg">
        <div class="toast-wrapper">
          <div class="toast" v-html="showText"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Toast",
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
      visiable: false,
      showText: ""
    };
  },
  methods: {
    hide() {
      this.visiable = false;
    },
    show() {
      this.changeText(this.text);
      clearTimeout(this.task);
      this.task = null;
      this.visiable = true;
      this.task = setTimeout(() => {
        this.visiable = false;
      }, this.timeout);
    },
    continueShow() {
      this.changeText(this.text);
      clearTimeout(this.task);
      this.task = null;
      this.visiable = true;
    },
    changeText(text) {
      this.showText = text;
    }
  }
};
</script>

<style lang="scss"  scoped>
@import "@/assets/styles/global.scss";
.toast-bg-wrapper {
  position: absolute;
  z-index: 2000;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: transparent;
  .toast-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
}
</style>

