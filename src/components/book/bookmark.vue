<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="icondown">
        <i class="icon-down"></i>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFix? fixStyle : {}" ref="iconWrapper">
      <bookmark :color="color"></bookmark>
    </div>
  </div>
</template>

<script>
import { bookMixin } from "@/utils/mixin.js";
import bookmark from "../Common/Bookmark.vue";
import { realPx } from "@/utils/utils.js";
import { getBookmark, setBookmark } from "@/utils/localStorage.js";
const BLUE = "#346cbc";
const WHITE = "#fff";
export default {
  mixins: [bookMixin],
  data() {
    return {
      text: this.$t("book.pulldownAddMark"),
      color: WHITE,
      isFix: false
    };
  },
  computed: {
    //   第二阶段的高度
    height() {
      return realPx(35);
    },
    //   第三阶段的极限值
    critical() {
      return realPx(50);
    },
    fixStyle() {
      return {
        position: "fixed",
        right: 0,
        top: 0
      };
    }
  },
  components: {
    bookmark
  },
  watch: {
    offsetY(val) {
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return;
      }
      // 状态2 未到达临界状态
      if (val >= this.height && val < this.critical) {
        this.beforeCritical(val);
        //   状态3 到达临界状态
      } else if (val >= this.critical) {
        this.afterCritical(val);
        // 状态1: 未到达高度
      } else if (val > 0 && val < this.height) {
        this.beforeHeight();
        // 状态4 归位
      } else if (val === 0) {
        this.restore();
      }
    },
    isBookmark() {
      if (this.isBookmark) {
        this.color = BLUE;
        this.isFix = true;
      } else {
        this.color = WHITE;
        this.isFix = false;
      }
    }
  },
  methods: {
    // 添加书签
    addBookMark() {
      // 存放书签的数组
      this.bookmarks = getBookmark(this.fileName)
        ? getBookmark(this.fileName)
        : [];
      let currentLocation = this.currentBook.rendition.currentLocation();
      // 获取 !前面的内容
      let cfiBase = currentLocation.start.cfi.replace(/!.*/, "");
      let startcfi = currentLocation.start.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");
      let endcfi = currentLocation.end.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");
      let cfiRange = `${cfiBase}!,${startcfi},${endcfi})`;
      // 调用 epubjs 中的 api 调用指定 cfi 范围内的 内容
      this.currentBook.getRange(cfiRange).then(range => {
        if (range) {
          this.bookmarks.push({
            // 把 cfi 传递进去方便通过书签可以进行跳转
            cfi: currentLocation.start.cfi,
            text: range.toString()
          });
          setBookmark(this.fileName, this.bookmarks);
          // 保存到 vuex 中去
          this.setBookMark(this.bookmarks);
        }
      });
    },
    // 删除书签
    removeBookMark() {
      let currentLocation = this.currentBook.rendition.currentLocation();
      let cfi = currentLocation.start.cfi;
      this.bookmarks = getBookmark(this.fileName);
      if (this.bookmarks) {
        // 遍历现有书签,因为在上面保存书签的时候有保存当前cfi的值
        // 所以判断如果当前的 cfi 和 现在书签数组的存在相同的则删除
        this.bookmarks = this.bookmarks.filter(item => {
          return item.cfi != cfi;
        });
      }
      setBookmark(this.fileName, this.bookmarks);
      this.setBookMark(this.bookmarks);
      this.setIsBookmark(false);
    },
    // 状态1: 未超过书签的高度
    beforeHeight() {
      if (this.isBookmark) {
        // 如果当前页是书签页就进行删除书签处理
        this.text = this.$t("book.pulldownDeleteMark");
        this.color = BLUE;
        this.isFix = true;
      } else {
        this.text = this.$t("book.pulldownAddMark");
        this.color = WHITE;
        this.isFix = false;
      }
    },
    // 状态2: 未达到临界值
    beforeCritical(val) {
      //   让我们的书签随着最外层容器一起运动 相对静止!!
      this.$refs.bookmark.style.top = `-${val + 5}px`;
      this.beforeHeight();
      // 获取标签 让它进行180旋转
      let icondown = this.$refs.icondown;
      if ((icondown.style.transform = "rotate(180deg)")) {
        icondown.style.transform = "rotate(0deg)";
      }
    },
    // 状态3: 超过临界值
    afterCritical(val) {
      this.$refs.bookmark.style.top = `-${val + 5}px`;
      if (this.isBookmark) {
        // 如果当前页是书签页
        this.text = this.$t("book.releaseDeleteMark");
        this.color = WHITE;
        this.isFix = false;
      } else {
        this.text = this.$t("book.releaseAddMark");
        this.color = BLUE;
        this.isFix = true;
      }
      let icondown = this.$refs.icondown;
      if (
        (icondown.style.transform =
          "" || icondown.style.transform == "rotate(0deg)")
      ) {
        icondown.style.transform = "rotate(180deg)";
      }
    },
    // 状态4: 归位
    restore() {
      this.$refs.bookmark.style.top = `-${this.height}px`;
      this.$refs.icondown.style.transform = "rotate(0deg)";
      if (this.isFix) {
        this.setIsBookmark(true);
        this.addBookMark();
      } else {
        this.setIsBookmark(false);
        this.removeBookMark();
      }
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss">
@import "./../../assets/styles/global.scss";
.ebook-bookmark {
  position: absolute;
  left: 0;
  top: px2rem(-35);
  z-index: 200;
  width: 100%;
  height: px2rem(35);
  color: red;
  background: #7d7d7d;
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: px2rem(45);
    bottom: 0;
    display: flex;
    .ebook-bookmark-down-wrapper {
      font-size: px2rem(14);
      color: white;
      transition: all 0.2s linear;
      line-height: px2rem(16);
    }
    .ebook-bookmark-text {
      font-size: px2rem(14);
      color: white;
      line-height: px2rem(16);
    }
  }
  .ebook-bookmark-icon-wrapper {
    z-index: 0;
    position: absolute;
    right: 0;
    top: 0;
    margin-right: px2rem(15);
    // height: px2rem(45);
  }
}
</style>