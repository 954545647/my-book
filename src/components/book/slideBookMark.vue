<template>
  <div class="ebook-slide-bookmark">
    <div
      class="slide-bookmark-title"
    >{{$t('book.bookmark')}}丶{{bookdata.length? bookdata.length : 0}}</div>
    <scroll :top="48" :bottom="48" class="slide-bookmark-list">
      <div
        class="slide-bookmark-item"
        v-for="(item,index) in bookdata"
        :key="index"
        @click="displayMark(item.cfi)"
      >
        <div class="slide-bookmark-item-ico">
          <div class="icon-bookmark"></div>
        </div>
        <div class="slide-bookmark-item-text">{{item.text}}</div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { bookMixin } from "@/utils/mixin.js";
import Scroll from "../Common/Scroll";
import { getBookmark } from "@/utils/localStorage.js";
export default {
  mixins: [bookMixin],
  components: {
    Scroll
  },
  methods: {
    displayMark(cfi) {
      this.display(cfi);
      this.hideMenu();
    }
  },
  mounted() {
    //   一刷新就去 localStorage 中获取值并且保存到 vuex 中去
    this.setBookMark(getBookmark(this.fileName)?getBookmark(this.fileName):[]);
  }
};
</script>

<style lang="scss">
@import "./../../assets/styles/global.scss";
.ebook-slide-bookmark {
  width: 100%;
  height: px2rem(48);
  .slide-bookmark-title {
    font-size: px2rem(16);
    height: 100%;
    width: 100%;
    @include left;
    padding-left: px2rem(20);
  }
  .slide-bookmark-list {
    width: 100%;
    height: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-bookmark-item {
      font-size: px2rem(14);
      display: flex;
      padding: px2rem(15) 0;
      // height: px2rem(40);
      .slide-bookmark-item-ico {
        flex: 0 0 px2rem(30);
        padding-top: px2rem(15);
        .icon-bookmark {
          width: px2rem(20);
          height: px2rem(20);
          border-radius: 50%;
          background: #ddd;
          @include center;
          line-height: px2rem(30);
        }
      }
      .slide-bookmark-item-text {
        text-overflow: ellipsis;
        display: -webkit-box;
        overflow: hidden;
        white-space: normal;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        word-break: keep-all;
        line-height: px2rem(15);
        max-height: px2rem(45);
      }
    }
  }
}
</style>
