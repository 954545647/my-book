<template>
  <!-- 这里的外层一下子就变成了display,所以过渡动画也跟着消失了 -->
  <!-- 需要新增一个变量来控制延迟 -->
  <div class="popup-wrapper" v-show="popupVisiable">
    <transition name="fade">
      <div class="popup-bg" @click.stop.prevent="hide()" v-if="popupVisiable"></div>
    </transition>

    <transition name="popup">
      <div class="popup" v-if="visiable">
        <div class="popup-text" v-if="text && text.length > 0">{{text}}</div>
        <div class="popup-btn" v-for="(item,index) in btn" :key="index" @click="item.click">
          <span class="popup-btn-text">{{item.text}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
export default {
  name: "popup",
  data() {
    return {
      popupVisiable: false,
      visiable: false
    };
  },
  props: {
    text: {
      type: [Number, String],
      default: ""
    },
    btn: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 显示弹出窗口
    show() {
      this.popupVisiable = true;
      setTimeout(() => {
        this.visiable = true;
      });
    },
    hide() {
      // 先让按钮隐藏,两秒后再让主控制变量隐藏
      this.visiable = false;
      setTimeout(() => {
        this.popupVisiable = false;
      }, 200);
    }
  }
};
</script>


<style lang="scss">
@import "@/assets/styles/global.scss";
.popup-wrapper {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  height: 100%;
  .popup-bg {
    width: 100%;
    height: 100%;
  }
  .popup {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 2000;
    .popup-text {
      font-size: px2rem(12);
      text-align: center;
      line-height: px2rem(12);
      height: px2rem(44);
      color: #999;
      padding: px2rem(5) px2rem(10);
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .popup-btn {
      height: px2rem(60);
      font-size: px2rem(16);
      @include center;
      .popup-btn-text {
        font-weight: bold;
        color: #696969;
      }
    }
  }
}
</style>