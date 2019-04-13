<template>
  <div class="shelf-list">
    <div v-for="item in shelfList" :key="item.id" class="shelf-list-item-wrapper">
      <shelf-item :data="item" :style="{height:itemHeight}"></shelf-item>
      <div class="shelf-list-title-wrapper">
        <span class="shelf-list-title">{{item.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ShelfItem from "@/components/shelf/ShelfItem";
import { storeShelfMixin } from "@/utils/mixin.js";
import {realPx} from '@/utils/utils';
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfItem
  },
  computed: {
    itemHeight() {
      return (window.innerWidth -realPx(120)) / 3 * 350 / 250 + "px";
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
.shelf-list {
  position: absolute;
  top: px2rem(92);
  left: 0;
  z-index: 100;
  flex-flow: row wrap; // 水平排列并且换行
  display: flex;
  width: 100%;
  padding: 0 px2rem(15);
  box-sizing: border-box;
  .shelf-list-item-wrapper {
    height: 100%;
    flex: 0 0 33.33%;
    width: 33.33%;
    padding: px2rem(15) px2rem(15);
    box-sizing: border-box;
    .shelf-list-title-wrapper{
      margin-top: px2rem(5);
      .shelf-list-title{
        font-size: px2rem(14);
        color: #444;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        white-space: normal;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
}
</style>
