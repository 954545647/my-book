<template>
  <div class="book" ref="book">
    <book-title></book-title>
    <reader></reader>
    <book-menu></book-menu>
    <book-mark></book-mark>
    <book-footer></book-footer>
  </div>
</template>

<script>
import reader from "./../../components/book/reader";
import BookTitle from "./../../components/book/title.vue";
import BookMenu from "./../../components/book/menu.vue";
import BookMark from "@/components/book/bookmark.vue";
import BookFooter from '@/components/book/bookFooter.vue';
import { getReadTime, setReadTime } from "@/utils/localStorage.js";
import { setInterval, clearInterval } from "timers";
import { bookMixin } from "@/utils/mixin.js";
export default {
  mixins: [bookMixin],
  components: {
    reader,
    BookTitle,
    BookMenu,
    BookMark,
    BookFooter
  },
  watch: {
    // 在蒙版上面做完移动事件之后,将移动的距离保存到vuex中
    // 然后在主组件中通过监听 offsetY 的值的变化来实现移动
    offsetY(val) {
      // 如果移动的距离大于0
      // 只有在书籍分页完成并且没有显示菜单的时候可以进行下拉标签
      if (!this.menuVisible && this.bookAvailable) {
        if (val > 0) {
          this.move(val);
        }
        // 如果松手了进行还原
        if (val === 0) {
          this.restore();
        }
      }
    }
  },
  methods: {
    restore() {
      this.$refs.book.style.top = 0;
    },
    move(val) {
      this.$refs.book.style.top = val + "px";
      // this.$refs.book.style.transition = `all .2s linear`;
      // // 两秒后清除过渡动画
      // setTimeout(() => {
      //   this.$refs.book.style.transition = "";
      // }, 200);
    },
    // 计算时间
    startTime() {
      let readTime = getReadTime(this.fileName);
      // 如果是第一次进入
      if (!readTime) {
        readTime = 0;
      }
      this.time = setInterval(() => {
        readTime++;
        if (readTime % 30 === 0) {
          setReadTime(this.fileName, readTime);
        }
      }, 1000);
    }
  },
  mounted() {
    // 开始计时
    this.startTime();
  },
  // 清除定时器
  beforeDestroy() {
    if (this.time) {
      clearInterval(this.time);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../../assets/styles/global.scss";
.book {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>

