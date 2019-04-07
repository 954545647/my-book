<template>
<!-- 这是设置字体样式组件 -->
  <transition name="slide-font">
    <div class="font-family-list" v-show="fontFamilyVisible && menuVisible">
      <div class="title-wrapper">
        <i class="icon-down2" @click="changeListVisible"></i>
        <span>{{$t('book.selectFont')}}</span>
      </div>
      <div class="font-list">
        <div
          class="item"
          v-for="(item,index) in fontList"
          :key="index"
          @click="changeFontFamily(item.font)"
        >
          <span
            class="title"
            :style="{color: item.font == defaultFontFamily ? 'blue' : '#6E6E6E'}"
          >{{item.font}}</span>
          <i class="icon-check" v-show="item.font == defaultFontFamily"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { bookMixin } from "@/utils/mixin.js";
import { FONT_FAMILY } from "@/utils/book.js";
import { setFontFamily } from "@/utils/localStorage.js";
export default {
  mixins: [bookMixin],
  data() {
    return {
      fontList: FONT_FAMILY
    };
  },
  methods: {
    //   改变字体列表的展示与否
    changeListVisible() {
      this.setFontFamilyVisible(false);
    },
    // 改变字体类型
    changeFontFamily(val) {
      this.setDefaultFontFamily(val);
      // 保存到 localStorage 中去
      setFontFamily(this.fileName, val);  //参数1通过vuex获取,参数2通过传参
      // 通过调用API改变字体类型  需要额外把css文件注入到 iframe 中
      if (val === "Default") {
        this.currentBook.rendition.themes.font("Times New Roman");
      } else {
        this.currentBook.rendition.themes.font(val);
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/styles/global.scss";
.font-family-list {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: px2rem(250);
  background: white;
  z-index: 101;
  display: flex;
  flex-direction: column;
  .title-wrapper {
    flex: 0 0 px2rem(40);
    display: flex;
    font-size: px2rem(16);
    height: 100%;
    border-bottom: px2rem(1) solid #ccc;
    .icon-down2 {
      flex: 0 0 px2rem(30);
      @include right;
    }
    span {
      flex: 1;
      @include center;
      padding-right: px2rem(20);
    }
  }
  .font-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: px2rem(14);
    .item {
      flex: 1;
      display: flex;
      .title {
        flex: 2;
        @include left;
        padding-left: px2rem(15);
      }
      i {
        flex: 3;
        @include right;
        padding-right: px2rem(20);
      }
    }
  }
}
</style>