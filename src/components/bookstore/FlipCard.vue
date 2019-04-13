<template>
  <div class="flip-card-wrapper" v-show="flipCardVisiable">
    <!-- 卡片特效 -->
    <div
      class="flip-card-bg"
      :class="{hasAnimation: runFlipCardAnimation}"
      v-show="runFlipCardAnimation"
    >
      <div
        class="flip-card"
        v-for="(item,index) in flapCardList"
        :key="index"
        :style="{zIndex : item.zIndex}"
      >
        <div class="flip-card-circle">
          <div
            class="flip-card-semi-cricle flip-card-left"
            :style="showCircle(item,'left')"
            ref="left"
          ></div>
          <div
            class="flip-card-semi-cricle flip-card-right"
            :style="showCircle(item,'right')"
            ref="right"
          ></div>
        </div>
      </div>
      <!-- 小球 -->
      <div class="ball-wrapper">
        <div
          class="ball"
          v-for="(item,index) in ballList"
          :key="index"
          :class="{ballAnimation: runBallAnimation}"
        ></div>
      </div>
    </div>
    <!-- 推荐书本 -->
    <div
      class="book-card"
      v-show="!randomBookVisiable"
      :class="{hasBookAnimation: !randomBookVisiable}"
    >
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img :src="randomBook.cover" alt>
        </div>
        <div class="content-wrapper">
          <div class="title">
            <span class="title-text">{{randomBook.title}}</span>
          </div>
          <div class="author">
            <span class="author-text">{{randomBook.author}}</span>
          </div>
          <!-- <div class="category"></div> -->
        </div>
        <div class="read-btn" @click="readNow()">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <!-- 关闭按钮 -->
    <div class="close-btn-wrapper" @click="closeCard()">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from "@/utils/mixin.js";
import { flapCardList } from "@/utils/store.js";
import { setInterval, setTimeout, clearInterval, clearTimeout } from "timers";
import { debug } from "util";
export default {
  mixins: [storeHomeMixin],
  data() {
    return {
      flapCardList,
      front: 0,
      back: 1,
      speed: 50, //动画转到的速度
      runFlipCardAnimation: false, // 是否进行弹性缩减特效
      ballList: null,
      runBallAnimation: false, // 是否有烟花特效
      randomBookVisiable: true
    };
  },
  props: {
    randomBook: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    // 监听flipCardVisiable值的变化,如果为true,开启动画
    flipCardVisiable(val) {
      if (val) {
        this.runFlipCardAnimation = true;
        this.runBallAnimation = true;
        setTimeout(() => {
          this.startFlipCard();
        }, 300);
        setTimeout(() => {
          // 因为小球动画需要执行.075s 执行为false之后就可以把小球给去掉
          this.runBallAnimation = false;
        }, 750);
      }
    }
  },
  methods: {
    // 立即阅读
    readNow() {
      console.log(1);
    },
    // 关闭卡片
    closeCard() {
      // 设置flipCardVisiable值为false
      this.setFlipCardVisiable(false);
      this.stopFlipCard();
      this.runFlipCardAnimation = false;
      this.randomBookVisiable = true;
    },
    // 卡片样式
    showCircle(item, posi) {
      return {
        backgroundSize: item.backgroundSize,
        backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
        // 背景图片需要区分是左半部分还是右半部分
        backgroundImage: posi === "left" ? item.imgLeft : item.imgRight
      };
    },
    // 翻转动画
    rotate(index, type) {
      const item = this.flapCardList[index];
      let dom;
      // 因为我们是循环遍历的 所以 this.$refs.right是一个数组
      // 如果是正面 转动右边半圆
      if (type === "front") {
        dom = this.$refs.right[index];
      } else if (type === "back") {
        // 或者左边半圆
        dom = this.$refs.left[index];
      }
      // Y轴旋转
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`;
      // 背景颜色
      dom.style.backgroundColor = `rgb(${item.r},${item.old},${item.b})`;
    },
    // 翻转初始化
    flipCardRotate() {
      let frontFlipCard = this.flapCardList[this.front];
      let backFlipCard = this.flapCardList[this.back];
      frontFlipCard.rotateDegree += 10;
      frontFlipCard.old -= 5; //加深
      backFlipCard.rotateDegree -= 10;
      backFlipCard.old += 5; //变浅
      // 当背面的左侧圆和正面的左侧圆一起转到到90度时,背面的左侧圆的zIndex变大
      if (
        frontFlipCard.rotateDegree === 90 &&
        backFlipCard.rotateDegree === 90
      ) {
        backFlipCard.zIndex += 2;
      }
      this.rotate(this.front, "front");
      this.rotate(this.back, "back");
      // 当正面的右侧圆转到180度和背面左侧圆回到原位之后,进行下一组旋转
      if (
        frontFlipCard.rotateDegree === 180 &&
        backFlipCard.rotateDegree === 0
      ) {
        this.next(); // 下一组翻转
      }
    },
    next() {
      // 下一组翻转之前需要将原先所有的操作还原
      let frontFlipCard = this.flapCardList[this.front];
      let backFlipCard = this.flapCardList[this.back];
      // 颜色和转动角度都还原
      frontFlipCard.rotateDegree = 0;
      frontFlipCard.old = frontFlipCard.g;
      backFlipCard.rotateDegree = 0;
      backFlipCard.old = backFlipCard.g;
      this.rotate(this.front, "front"); // 正面还原
      this.rotate(this.back, "back");
      // 要操作的对象 +1
      this.front++;
      this.back++;
      const len = this.flapCardList.length;
      if (this.front >= len) {
        this.front = 0;
      }
      if (this.back >= len) {
        this.back = 0;
      }
      // 让zIndex进行迭代:  让后面的圆的 zIndex 增大
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len);
      });
      // 让下一组背面的左侧圆和正面圆覆盖
      this.prepareFlip();
    },
    // 背面左侧半圆的准备工作
    prepareFlip() {
      // 让左边的半圆和右边的半圆重叠 即背面的左边半圆翻转180度
      let backFlipCard = this.flapCardList[this.back];
      backFlipCard.rotateDegree = 180; // 实现和右侧圆重叠
      // 我们需要让颜色预先加深 然后转到才会一致
      // 北面的左半圆的前90度转动是被正面的右半圆覆盖,等过了90度后才开始切换zIndex,继续转到,所以是180度转动
      backFlipCard.old = backFlipCard.g - 5 * 18;
      this.rotate(this.back, "back");
    },
    // 停止卡片动画
    stopFlipCard() {
      this.runFlipCardAnimation = false;
      if (this.time) {
        clearInterval(this.time);
      }
      this.reset();
    },
    // 重置所有样式
    reset() {
      this.front = 0;
      this.back = 1;
      this.flapCardList.forEach((item, index) => {
        item.rotateDegree = 0;
        item.old = item.g;
        // 将zIndex值还原
        item.zIndex = 100 - index;
        this.rotate(index, "front");
        this.rotate(index, "back");
      });
      this.runFlipCardAnimation = false;
      this.runBallAnimation = false;

      if (this.bookTime) {
        clearTimeout(this.bookTime);
      }
    },
    // 核心思路是一开始左侧的半圆其实是翻转到了右侧!
    // 跟着右侧的半圆一起旋转,到了90deg后,开始变化zIndex,转下面的左侧半圆
    // 背面的左侧半圆其实是和正面的右侧半圆一起翻转的!!!
    // 切换动画是通过 z-index 切换
    startFlipCard() {
      this.prepareFlip();
      this.time = setInterval(() => {
        this.flipCardRotate();
      }, this.speed);
      // 默认3秒后动画结束,
      // 还有一种情况就是我们提前点击X按钮,还有到指定时间随机书本还没显示
      // 那么当我们重新点击生成随机书籍按钮的时候,可能这里的定时器才刚好完成,
      // 所以我们需要把定时器清空
      this.bookTime = setTimeout(() => {
        this.stopFlipCard();
        this.randomBookVisiable = false;
      }, 1500);
    }
  },
  created() {
    this.ballList = [];
    for (var i = 0; i < 18; i++) {
      this.ballList.push(`ball${i}`);
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
@import "@/assets/styles/fireworks.scss";
.flip-card-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba($color: #000000, $alpha: 0.5);
  z-index: 500;
  @include center;
  // 关闭按钮样式
  .close-btn-wrapper {
    position: absolute;
    left: 50%;
    bottom: px2rem(60);
    background: #333333;
    margin: auto;
    transform: translate(-50%, 0);
    border-radius: 50%;
    @include center;
    .icon-close {
      width: px2rem(50);
      height: px2rem(50);
      @include center;
      color: white;
      font-size: px2rem(24);
    }
  }
  // 卡片翻转样式
  .flip-card-bg {
    position: relative;
    width: px2rem(64);
    height: px2rem(64);
    border-radius: px2rem(5);
    background: white;
    transform: scale(0); // 这里默认隐藏,因为下面的动画会让它重新显示回来!!!
    opacity: 0;
    &.hasAnimation {
      // both 表示动画保留最后一个画面
      animation: cardAnimation 0.3s linear both;
    }
    @keyframes cardAnimation {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flip-card {
      height: px2rem(48);
      width: px2rem(48);
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .flip-card-circle {
        width: 100%;
        height: 100%;
        display: flex;
        .flip-card-semi-cricle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          perspective: 10px;
          // 旋转到背面影藏起来
          backface-visibility: hidden;
        }
        .flip-card-left {
          // 左边图片的圆左半部分变圆 图片居右显示
          border-radius: px2rem(24) 0 0 px2rem(24);
          background-position: center right;
          transform-origin: right;
        }
        .flip-card-right {
          border-radius: 0 px2rem(24) px2rem(24) 0;
          background-position: center left;
          // 原本是360度旋转
          transform-origin: left;
        }
      }
    }
    .ball-wrapper {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .ball {
        border-radius: 50%;
        z-index: 3000;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        &.ballAnimation {
          @for $i from 1 through length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  // 推荐书本样式
  .book-card {
    position: relative;
    left: 0;
    top: 0;
    width: px2rem(240);
    height: px2rem(300);
    border-radius: px2rem(15);
    background: #fff;
    &.hasBookAnimation {
      animation: bookAnimation .3s linear;
    }
    @keyframes bookAnimation {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .book-card-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: px2rem(20) px2rem(15) px2rem(40) px2rem(15);
      box-sizing: border-box;
      .img-wrapper {
        height: px2rem(130);
        margin: 0 auto;
        padding-bottom: px2rem(15);
        flex: 0 0 px2rem(130);
        img {
          height: 100%;
          background-size: 100% 100%;
        }
      }
      .content-wrapper {
        font-size: px2rem(16);
        text-align: center;
        padding: 0 px2rem(20);
        margin-top: px2rem(10);
        .title {
          font-size: px2rem(16);
          font-weight: 700;
          line-height: px2rem(18);
          color: #333;
          @include ellipsis2(2);
        }
        .author {
          margin-top: px2rem(10);
          color: #666;
          @include ellipsis2(2);
        }
      }
      .read-btn {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background: #4aaafe;
        padding: px2rem(15) 0 ;
        text-align: center;
        font-size: px2rem(14);
        color: white;
        border-radius: 0 0 px2rem(15) px2rem(15);
      }
    }
  }
}
</style>
