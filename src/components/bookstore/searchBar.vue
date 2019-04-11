<template>
  <div>
    <div class="search-bar" :class="{hideTitle: !titleVisiable, hideShadow: shadowVisiable}">
      <transition name="hide-title">
        <div class="search-bar-title-wrapper" v-show="titleVisiable">
          <div class="title-text-wrapper">
            <span class="title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showCard()">
            <i class="icon-shake icon"></i>
          </div>
        </div>
      </transition>
      <div
        class="title-icon-back-wrapper"
        :class="{hideTitle: !titleVisiable}"
        @click="showTitleBar()"
      >
        <i class="icon-back icon"></i>
      </div>
      <div class="search-bar-input-wrapper" :class="{hideTitle: !titleVisiable}">
        <div class="search-bar-dom" :class="{hideTitle: !titleVisiable}" @click="hideHotSearch()"></div>
        <div class="search-bar-input">
          <i class="icon-search icon"></i>
          <input
            type="text"
            class="input"
            :placeholder="$t('home.hint')"
            v-model="searchText"
            @click="showHotSearch()"
          >
        </div>
      </div>
    </div>
    <!-- 热门搜索 -->
    <transition name="hot-search-move">
      <div class="hot-serach" v-show="!titleVisiable && hotSearchVisiable">
        <scroll :top="52" @onScroll="onScroll" ref="hotSearch">
          <hot-search
            :searchList="searchList.hotSearch"
            :title="$t('home.hotSearch')"
            :title2="$t('home.change')"
          ></hot-search>
          <div class="line"></div>
          <hot-search
            :searchList="searchList.historySearch"
            :title="$t('home.historySearch')"
            :title2="$t('home.clear')"
          ></hot-search>
        </scroll>
      </div>
    </transition>
  </div>
</template>


<script>
import { storeHomeMixin } from "@/utils/mixin.js";
import HotSearch from "./HotSearch.vue";
import Scroll from "../Common/Scroll";
import {home} from '@/api/store.js';  // axios方法
export default {
  mixins: [storeHomeMixin],
  data() {
    return {
      searchText: "",
      titleVisiable: true,
      shadowVisiable: true,
      title: "",
      title2: "",
      searchList: {
        hotSearch: [
          {
            type: 1,
            text: "Self-Reported Population Health",
            num: "1.8万"
          },
          {
            type: 1,
            text: "Library and Information Sciences",
            num: "1.1万"
          },
          {
            type: 1,
            text: "Global Business Strategy",
            num: "1.3万"
          },
          {
            type: 1,
            text: "Corporate Data Quality",
            num: "1.0万"
          },
          {
            type: 1,
            text: "Verrechnungspreise",
            num: "3.9万"
          }
        ],
        historySearch: [
          {
            type: 2,
            text: "Computer Science"
          },
          {
            type: 1,
            text: "Building the Infrastructure for Cloud Security"
          },
          {
            type: 2,
            text: "ePub"
          },
          {
            type: 2,
            text: "api"
          },
          {
            type: 2,
            text: "Vue.js"
          },
          {
            type: 2,
            text: "Nginx"
          },
          {
            type: 2,
            text: "Java"
          },
          {
            type: 2,
            text: "hdfs"
          },
          {
            type: 2,
            text: "vuejs"
          },
          {
            type: 2,
            text: "es6"
          },
          {
            type: 2,
            text: "Intel"
          },
          {
            type: 1,
            text: "Pro Git"
          },
          {
            type: 2,
            text: "imooc"
          },
          {
            type: 2,
            text: "Education"
          },
          {
            type: 2,
            text: "Springer"
          },
          {
            type: 2,
            text: "Environment"
          }
        ]
      }
    };
  },
  components: {
    HotSearch,
    Scroll
  },
  watch: {
    // 监听vuex中offsetY的值
    offsetY(val) {
      if (val > 0) {
        this.hideTitleBar();
        this.showShadow();
      } else {
        this.showTitleBar();
        this.hideShadow();
      }
    },
    hotSearchScroll(val) {
      if (val > 0) {
        this.showShadow();
      } else {
        this.hideShadow();
      }
    }
  },
  methods: {
    // 隐藏头部书城
    hideTitleBar() {
      this.titleVisiable = false;
    },
    showTitleBar() {
      this.titleVisiable = true;
    },
    // 隐藏阴影
    hideShadow() {
      this.shadowVisiable = true;
    },
    showShadow() {
      this.shadowVisiable = false;
    },
    // 显示热门搜索
    showHotSearch() {
      this.hideTitleBar();
      this.hideShadow();
      this.setHotSearchVisiable(true);
      this.$nextTick(() => {
        this.reset();
      });
    },
    hideHotSearch() {
      this.showTitleBar();
      this.setHotSearchVisiable(false);
      if (this.offsetY > 0) {
        this.hideTitleBar();
        this.showShadow();
      } else {
        this.showTitleBar();
        this.hideShadow();
      }
    },
    // 展示翻转卡片
    showCard(){
      this.setFlipCardVisiable(true)
    },
    // 滚动
    onScroll(val) {
      this.setHotSearchScroll(val);
    },
    // 让我们的搜索框每次都重置
    reset() {
      // 让滚动条回到初始位置
      this.$refs.hotSearch.scrollTo(0, 0);
    }
  }
};
</script>


<style lang="scss">
@import "./../../assets/styles/global.scss";
.search-bar {
  position: relative;
  width: 100%;
  height: px2rem(98);
  z-index: 150;
  box-shadow: 0 px2rem(2) px2rem(2) rgba(0, 0, 0, 0.1);
  &.hideTitle {
    height: px2rem(56);
  }
  &.hideShadow {
    box-shadow: none;
  }
  .search-bar-title-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    height: px2rem(42);
    width: 100%;

    .title-text-wrapper {
      position: absolute;
      width: 100%;
      height: px2rem(42);
      @include center;
    }
    .title-icon-shake-wrapper {
      position: absolute;
      right: px2rem(15);
      top: 0;
      @include center;
      height: px2rem(42);
    }
  }
  .title-icon-back-wrapper {
    position: absolute;
    left: px2rem(15);
    top: 0;
    @include center;
    height: px2rem(42);
    transition: height 0.2s linear;
    &.hideTitle {
      height: px2rem(56);
    }
  }
  .search-bar-input-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(56);
    padding: px2rem(10) px2rem(15);
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: px2rem(42);
    transition: top 0.2s linear;
    &.hideTitle {
      top: 0;
    }
    .search-bar-dom {
      flex: 0 0 0;
      width: 0;
      transition: all 0.2s linear;
      &.hideTitle {
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input {
      flex: 1;
      border-radius: px2rem(20);
      background: #f4f4ff;
      width: 100%;
      padding: px2rem(5) px2rem(15);
      box-sizing: border-box;
      border: px2rem(1) solid #eee;
      @include left;
      .icon-search {
        color: #999;
      }
      .input {
        height: px2rem(24);
        width: 100%;
        border: none;
        background: transparent;
        margin-left: px2rem(15);
        font-size: px2rem(12);
        color: #666;
        // input框选中不会有边框
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #999;
        }
      }
    }
  }
}
.line {
  width: 100%;
  height: 0;
  border-top: px2rem(1) solid #eee;
  margin: px2rem(10) 0;
}
</style>