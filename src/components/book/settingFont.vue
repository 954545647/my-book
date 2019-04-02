<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible == 0">
      <div class="setting-font-size">
        <div class="preview" :style="{fontSize:this.fontSizeList[0].fontSize + 'px'}">小</div>
        <div class="select">
          <div
            class="select-wrapper"
            v-for="(item,index) in fontSizeList"
            :key="index"
            @click="changeSize(item.fontSize)"
          >
            <div class="line"></div>
            <div class="point-wrapper">
              <div class="point" v-show="defaultFontSize === item.fontSize">
                <div class="small-point"></div>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <div
          class="preview two"
          :style="{fontSize:this.fontSizeList[fontSizeList.length-1].fontSize + 'px'}"
        >大</div>
      </div>
      <div class="change-font-type">
        <div class="font-family-name" @click="showFontFamilyList">
          <span class="fontName">{{defaultFontFamily}}</span>
        </div>
        <div class="font-family-icon">
          <i class="icon-forward"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { bookMixin } from "@/utils/mixin.js";
import { FontSzieList } from "@/utils/book.js";
import { setFontSize } from "@/utils/localStorage.js";
export default {
  mixins: [bookMixin],
  data() {
    return {
      fontSizeList: FontSzieList
    };
  },
  methods: {
    changeSize(val) {
      // 设置默认字体大小
      this.setdefaultFontSize(val);
      // 保存到 LocalStroage 中
      setFontSize(this.fileName, val);
      // 通过调用API改变字体大小
      this.currentBook.rendition.themes.fontSize(val + "px");
    },
    showFontFamilyList() {
      this.setFontFamilyVisible(true);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/styles/global.scss";
.setting-wrapper {
  position: absolute;
  left: 0;
  bottom: px2rem(50);
  width: 100%;
  height: px2rem(90);
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.1);
  background: #fff;
  display: flex;
  flex-direction: column;
  .setting-font-size {
    display: flex;
    height: px2rem(70);
    background: #fff;
    flex: 2;
    .preview {
      @include center;
      color: #999;
      width: px2rem(40);
    }
    .two{
      padding-right: px2rem(15)
    }
    .select {
      flex: 1;
      display: flex;
      flex-direction: row;
      .select-wrapper {
        flex: 1;
        @include center;
        &:first-child {
          .line:first-child {
            border-top: none;
          }
        }
        &:last-child {
          .line:last-child {
            border-top: none;
          }
        }
        .line {
          //  左右横线是宽度自动伸缩,高度为0
          flex: 1;
          height: 0;
          border-top: px2rem(1) solid #ccc;
        }
        .point-wrapper {
          //   中间的竖线 没有宽度只有高度
          flex: 0 0 0;
          width: 0;
          height: px2rem(7);
          border-left: px2rem(1) solid #ccc;
          position: relative;
          .point {
            width: px2rem(20);
            height: px2rem(20);
            border-radius: 50%;
            background: #fff;
            border: px2rem(1) solid #ccc;
            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.1);
            position: absolute;
            left: px2rem(-10);
            top: px2rem(-8);
            @include center;
            .small-point {
              width: px2rem(6);
              height: px2rem(6);
              border-radius: 50%;
              background: #000;
            }
          }
        }
      }
    }
  }
  .change-font-type {
    flex: 1;
    font-size: px2rem(16);
    @include center;
  }
}
</style>