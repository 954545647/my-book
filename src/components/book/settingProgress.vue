<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible ===2">
      <div class="setting-progress">
        <div class="title">
          <span>{{this.getReadTimeText()}}</span>
          <!-- <span>{{this.time}}</span> -->
          <i class="icon-forward"></i>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection()">
            <i class="icon-back"></i>
          </div>
          <input
            type="range"
            class="progress"
            max="100"
            min="0"
            step="1"
            :disabled="!bookAvailable"
            @change="ProgressChange($event.target.value)"
            @input="ProgressInput($event.target.value)"
            :value="progress"
            ref="progress"
          >
          <div class="progress-icon-wrapper" @click="nextSection()">
            <i class="icon-forward"></i>
          </div>
        </div>
        <div class="content">
          <div class="text-wrapper">
            <span class="text-content-title">{{SectionName}}</span>
            <span class="percent">{{bookAvailable? progress + '%' : '加载中...'}}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<script>
import { bookMixin } from "@/utils/mixin.js";
import { getReadTime } from "@/utils/localStorage.js";
import { setInterval } from "timers";
export default {
  mixins: [bookMixin],
  computed: {
    SectionName() {
      if (this.section) {
        // 获取章节信息
        let sectionInfo = this.currentBook.section(this.section);
        if (
          sectionInfo &&
          sectionInfo.href &&
          this.currentBook &&
          this.currentBook.navigation
        ) {
          // 只能获取一级标题
          return this.currentBook.navigation.get(sectionInfo.href).label;
        }
      }

      // 这个如果epubjs电子书的格式正确就可以使用
      // this.navigation是一个一级数组,里面是各个章节的信息,
      // return this.section ? this.navigation[this.section].label : ''
    }
  },
  // data() {
  //   return {
  //     time: getReadTime(this.fileName)
  //   };
  // },
  // watch: {
  //   time: function() {
  //     this.time = getReadTime(this.fileName);
  //     return this.time;
  //   }
  // },
  methods: {
    // 上一章节
    prevSection() {
      if (this.section > 0 && this.bookAvailable) {
        // 设置当前 section 然后展示上一章节的内容
        this.setSection(this.section - 1).then(() => {
          this.displaySection();
        });
      }
    },
    // 下一章节
    nextSection() {
      // spine 表示阅读进度
      if (
        this.section < this.currentBook.spine.length - 1 &&
        this.bookAvailable
      ) {
        this.setSection(this.section + 1).then(() => {
          this.displaySection();
        });
      }
    },
    // 展示章节内容
    displaySection() {
      let sectionInfo = this.currentBook.section(this.section);
      if (sectionInfo && sectionInfo.href) {
        this.currentBook.rendition.display(sectionInfo.href).then(() => {
          this.refreshProgress();
        });
        // this.display(sectionInfo.href)
      }
    },

    // 刷新进度条   移动进入 mixin
    // refreshProgress() {
    //   // 获取 currentLocation 对象
    //   // 里面包含的内容有:
    //   // cfi定位符,
    //   // displayed对象: 中有 page(当前页数) total(该章节一共的页数)
    //   // index: 章节的序号
    //   // location: 是根据我们自己的分页算法算出来的页数
    //   let currentLocation = this.currentBook.rendition.currentLocation();
    //   // 通过 cfi 获取本章的开始位置,传入 percentageFromCfi 获取进度百分比
    //   // let progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi);
    //   let startCfi = currentLocation.start.cfi; // 开头的定位
    //   this.setProgress(Math.floor(currentLocation.start.percentage * 100));
    //   setLocation(this.fileName, startCfi);
    // },

    // 松开进度条触发
    ProgressChange(progress) {
      this.setProgress(progress).then(() => {
        this.displayProgress();
        this.updateProgress();
      });
    },
    // 拖动进度条时持续触发
    ProgressInput(progress) {
      this.setProgress(progress).then(() => {
        this.updateProgress();
      });
    },
    // 展示拖动内容
    displayProgress() {
      const cfi = this.currentBook.locations.cfiFromPercentage(
        this.progress / 100
      );
      this.currentBook.rendition.display(cfi).then(() => {
        this.refreshProgress();
      });
      // this.display(cfi);
    },
    // 更新进度条颜色
    updateProgress() {
      this.$refs.progress.style.cssText += `background-size: ${
        this.progress
      }% 100% !important`;
      // this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`;
    }
    // // 获取阅读时间
    // getReadTimeText() {
    //     return this.$t("book.haveRead").replace("$1", this.getReadTimeToMin());
    // },
    // // 把时间转换为分钟
    // getReadTimeToMin() {
    //   let readTime = getReadTime(this.fileName);
    //   if (!readTime) {
    //     return 0;
    //   } else {
    //     return Math.ceil(readTime / 60);
    //   }
    // }
  },
  updated() {
    this.updateProgress();
  }
};
</script>


<style lang="scss">
@import "@/assets/styles/global.scss";
.setting-wrapper {
  position: absolute;
  left: 0;
  bottom: px2rem(50);
  background: #fff;
  height: px2rem(90);
  z-index: 200;
  .setting-progress {
    display: flex;
    flex-direction: column;
    font-size: px2rem(14);
    text-align: center;
    height: 100%;
    width: 100%;
    .title {
      flex: 0 0 px2rem(25);
      padding-top: px2rem(8);
      box-sizing: border-box;
    }
    .progress-wrapper {
      display: flex;
      flex: 1;
      @include center;
      .progress-icon-wrapper {
        flex: 0 0 px2rem(30);
        @include center;
        font-size: px2rem(25);
      }
      .progress {
        -webkit-appearance: none;
        flex: 1;
        margin: 0 px2rem(10);
        height: px2rem(2);
        // background: linear-gradient(#999, #999) no-repeat, #ddd !important;
        // background-size: 0% 100%;
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: px2rem(20);
          height: px2rem(20);
          background: #fff;
          border-radius: 50%;
        }
      }
    }
    .content {
      flex: 0 0 px2rem(25);
      .text-wrapper {
        display: flex;
        @include center;
        .percent {
          padding-right: px2rem(10);
          font-size: px2rem(14);
        }
        .text-content-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 px2rem(10);
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
