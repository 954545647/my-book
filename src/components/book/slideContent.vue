<template>
  <div class="slide-contents">
    <!-- 顶部搜索框 -->
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <i class="icon-search"></i>
        </div>
        <!--  @keyup.enter.exact表示按键抬起,并且敲击回车之后触发 -->
        <input
          type="text"
          class="slide-contents-search-input"
          :placeholder="$t('book.searchHint')"
          @click="showSeach()"
          @keyup.enter.exact="handleChange()"
          v-model="inputVal"
        >
      </div>
      <div
        class="slide-contents-search-cancel"
        v-if="searchVisible"
        @click="hideSearch()"
      >{{$t('book.cancel')}}</div>
    </div>
    <!-- 头部图书信息 -->
    <div class="slide-contents-book-wrapper" v-show="contentVisible">
      <div class="slide-contents-book-img-wrapper">
        <!-- 这里的 cover 是通过 vuex 中来获取封面的 -->
        <img :src="cover" class="slide-contents-book-img">
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">{{metadata.title}}</div>
        <div class="slide-contents-book-author">{{metadata.creator}}</div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress + '%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{this.getReadTimeText()}}</div>
      </div>
    </div>
    <!-- 目录的内容 滚动条显示 -->
    <scroll :top="160" :bottom="48" class="slide-contents-list-wrapper" v-show="contentVisible">
      <div class="slide-contents-item" v-for="(item,index) in navigation" :key="index">
        <div
          class="slide-contents-item-label"
          :style="contentItemStyle(item)"
          :class="{selected: section === index}"
          @click="changeSection(item.href)"
        >{{item.label}}</div>
        <div class="slide-contents-item-page"></div>
      </div>
    </scroll>
    <!-- 查询的结果 滚动条显示-->
    <scroll
      :top="70"
      :bottom="48"
      class="slide-contents-search-scroll-wrapper"
      v-show="this.searchData.length"
    >
      <div class="slide-search-item" v-for="(item,index) in searchData" :key="index">
        <div class="slide-search-item-label" @click="changeItem(item)" v-html="item.excerpt"></div>
      </div>
    </scroll>
    <!-- 历史搜索 滚动条显示-->
    <scroll
      :top="70"
      :bottom="48"
      class="slide-contents-history-wrapper"
      v-show="historySeach && !contentVisible && !this.searchData.length"
    >
      <div class="history">历史搜索</div>
      <div class="slide-history-item" v-for="(item,index) in historySeach" :key="index">
        <div class="history-item">{{item}}</div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { bookMixin } from "@/utils/mixin.js";
import {
  getCover,
  setHistorySearch,
  getHistorySeach
} from "@/utils/localStorage.js";
import Scroll from "../Common/Scroll.vue";
import { px2rem } from "@/utils/utils.js";

export default {
  mixins: [bookMixin],
  data() {
    return {
      searchVisible: false,
      contentVisible: true,
      inputVal: "", //用户搜索的内容
      searchData: [], //搜索的结果
      historySeach: "" //历史搜索结果
    };
  },
  methods: {
    //   查询算法
    doSearch(q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(item =>
          item
            .load(this.currentBook.load.bind(this.currentBook))
            .then(item.find.bind(item, q))
            .finally(item.unload.bind(item))
        )
      ).then(results => Promise.resolve([].concat.apply([], results)));
    },
    // 用户在输入框输入内容时持续触发
    handleInput() {},
    // 当用户在输入框不断输入点击回车确定之后触发
    handleChange() {
      // 把用户输入的内容传递到查询算法中去
      this.historySeach = getHistorySeach(this.fileName);
      setHistorySearch(this.fileName, this.inputVal);
      this.doSearch(this.inputVal).then(result => {
        if (result.length > 0) {
          this.searchData = result;
          this.searchData.map(item => {
            item.excerpt = item.excerpt.replace(
              this.inputVal,
              `<span class="content-search-text">${this.inputVal}</span>`
            );
            return item;
          });
        } else {
          this.searchData = [{ excerpt: "无结果" }];
        }
      });
    },
    showSeach() {
      this.searchVisible = true;
      this.contentVisible = false;
    },
    hideSearch() {
      this.searchVisible = false;
      this.contentVisible = true;
      this.inputVal = "";
      this.searchData = "";
    },
    // 动态计算左边距 根据层级计算
    contentItemStyle(item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      };
    },
    // 点击目录跳转到指定章节
    changeSection(item) {
      // 调用 mixin 中的方法会保存进度
      this.display(item);
      this.hideMenu();
    },
    // 根据搜索内容进行跳转
    changeItem(item) {
      console.log(item)
      this.display(item.cfi);
      this.hideMenu();
      this.currentBook.rendition.annotations.highlight(item.cfi);
    }
  },
  components: {
    Scroll
  },
  mounted() {
    this.historySeach = getHistorySeach(this.fileName);
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
.slide-contents {
  width: 100%;
  display: flex;
  flex-direction: column;
  .slide-contents-search-wrapper {
    flex: 1;
    display: flex;
    font-size: px2rem(14);
    margin: px2rem(20) 0 px2rem(10);
    padding: 0 px2rem(15);
    height: px2rem(40);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      display: flex;
      .slide-contents-search-icon {
        flex: 0 0 px2rem(30);
        @include center;
      }
      .slide-contents-search-input {
        flex: 1;
        border: none;
        background: transparent;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 px2rem(40);
      @include right;
      font-size: px2rem(14);
    }
  }
  .slide-contents-book-wrapper {
    width: 100%;
    display: flex;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(15) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(50);
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      flex-direction: column;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .slide-contents-book-title {
        font-size: px2rem(14);
        line-height: px2rem(16);
        width: px2rem(148.75);
        @include ellipsis2(3);
      }
      .slide-contents-book-author {
        font-size: px2rem(12);
        width: px2rem(153.75);
        line-height: px2rem(14);
        margin-top: px2rem(10);
        @include ellipsis2(2);
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      flex-direction: column;
      font-size: px2rem(14);
      @include center;
      .slide-contents-book-progress {
        flex: 1;
        display: flex;
        // vertical-align: center;
        align-items: center;
        .progress {
          font-size: px2rem(14);
        }
        .progress-text {
          font-size: px2rem(12);
        }
      }
      .slide-contents-book-time {
        flex: 1;
        font-size: px2rem(12);
      }
    }
  }
  .slide-contents-list-wrapper {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      padding: px2rem(15) 0;
      box-sizing: border-box;
      font-size: px2rem(16);
      .slide-contents-item-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .slide-contents-search-scroll-wrapper {
    display: flex;
    flex-direction: column;
    .slide-search-item {
      width: 100%;
      padding: px2rem(15) px2rem(15);
      box-sizing: border-box;
      z-index: 300;
      .slide-search-item-label {
        font-size: px2rem(14);
        height: px2rem(40);
        @include ellipsis2(3);
      }
    }
  }
  .slide-contents-history-wrapper {
    z-index: 0;
    .history {
      height: px2rem(20);
      font-size: px2rem(16);
      padding: px2rem(15) px2rem(15);
      padding-bottom: 0;
    }
    .slide-history-item {
      padding: px2rem(5) px2rem(15) px2rem(15) px2rem(15);
      box-sizing: border-box;
      .history-item {
        height: px2rem(25);
        line-height: px2rem(25);
        font-size: px2rem(14);
        border-bottom: px2rem(1) solid #ccc;
      }
    }
  }
}
</style>
