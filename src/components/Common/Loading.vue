<template>
  <div class="book-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item,index) in data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem,subIndex) in item" :key="subIndex">
          <!-- 每一条线 -->
          <div class="ebook-loading-line" ref="line"></div>
          <!-- 通过移动蒙版来实现动画 -->
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
import { px2rem } from "@/utils/utils.js";
export default {
  data() {
    return {
      data: [[{}, {}, {}], [{}, {}, {}]],
      //   记录每个蒙版的长度
      maskWidth: [
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 }
      ],
      //   记录每一条线的长度
      lineWidth: [
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 }
      ],
      add: true,
      end: false
    };
  },
  mounted() {
    this.task = setInterval(() => {
      this.$refs.mask.forEach((item, index) => {
        //  获取蒙版元素
        let mask = this.$refs.mask[index];
        //  获取线条元素
        let line = this.$refs.line[index];
        // 获取蒙版的宽度
        let maskWidth = this.maskWidth[index];
        // 获取线条的宽度
        let lineWidth = this.lineWidth[index];
        // 第一个元素进来
        if (index === 0) {
          // 是增加并且限制宽度不会无限增长
          if (this.add && maskWidth.value < 16) {
            maskWidth.value++;
            lineWidth.value--;
          } else if (!this.add && lineWidth.value < 16) {
            maskWidth.value--;
            lineWidth.value++;
          }
          //   不是第一个元素
        } else {
          if (this.add && maskWidth.value < 16) {
            // 上一个蒙版
            let preMaskWidth = this.maskWidth[index - 1];
            // 如果上一个蒙版的宽度大于一半了,下一个蒙版可以开始动
            if (preMaskWidth.value >= 8) {
              maskWidth.value++;
              lineWidth.value--;
            }
          } else if (!this.add && lineWidth.value < 16) {
            // 如果是减少状态,线条长度增加,当大于一半的时候,下一条线条可以开始启动
            let preLineWidth = this.lineWidth[index - 1];
            if (preLineWidth.value >= 8) {
              maskWidth.value--;
              lineWidth.value++;
            }
          }
        }
        // 修改线条和蒙版的宽度
        mask.style.width = `${px2rem(maskWidth.value)}rem`;
        line.style.width = `${px2rem(lineWidth.value)}rem`;
        // 修改线条和蒙版的flex值
        mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`;
        line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`;
        // 如果到头了的话就改变方向
        if (index === this.maskWidth.length - 1) {
          if (this.add) {
            if (maskWidth.value === 16) {
              this.end = true;
            }
          } else {
            if (maskWidth.value === 0) {
              this.end = true;
            }
          }
        }
        // 到头了 就把添加的变减少 减少的变添加
        if (this.end) {
          this.add = !this.add;
          this.end = false;
        }
      });
    }, 20);
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
.book-loading {
  position: relative;
  z-index: 400;
  width: px2rem(63);
  height: px2rem(40);
  background: transparent;
  border: px2rem(2) solid #d7d7d7;
  border-radius: px2rem(3);
  .ebook-loading-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    .ebook-loading-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: px2rem(7) 0;
      box-sizing: border-box;
      .ebook-loading-line-wrapper {
        flex: 1;
        @include left;
        padding: 0 px2rem(7);
        box-sizing: border-box;
        .ebook-loading-line {
          flex: 0 0 px2rem(16);
          width: px2rem(16);
          height: px2rem(2);
          background: #d7d7d7;
        }
        .ebook-loading-mask {
          flex: 0 0 px2rem(0);
          width: px2rem(0);
          height: px2rem(2);
        }
      }
    }
    .ebook-loading-center {
      position: absolute;
      left: 50%;
      top: 0;
      width: px2rem(2);
      height: 100%;
      background: #d7d7d7;
    }
  }
}
</style>