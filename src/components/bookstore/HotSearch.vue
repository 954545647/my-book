<template>
  <div class="hot-search-wrapper">
    <!-- 热门搜索 -->
    <div>
      <div class="hot-search-title">
        <span class="label">{{title}}</span>
        <span class="btn">{{title2}}</span>
      </div>
      <div class="hot-search-list">
        <div class="hot-search-item" v-for="(item,index) in searchList" :key="index">
          <div class="icon-wrapper">
            <i class="icon-book incon" v-if="item.type===1"></i>
            <i class="icon-search incon" v-if="item.type===2"></i>
          </div>
          <div class="hot-search-text-wrapper">
            <div class="text">{{item.text}}</div>
            <div class="num" v-if="item.num">{{item.num}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchList: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    title2: {
      type: String,
      default: ""
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
.hot-search-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  .hot-search-title {
    flex: 0 0 px2rem(32);
    height: px2rem(32);
    width: 100%;
    display: flex;
    font-size: px2rem(14);
    padding: 0 px2rem(10);
    box-sizing: border-box;
    font-weight: bold;
    .label {
      flex: 1;
      @include left;
      color: #787878;
    }
    .btn {
      flex: 1;
      @include right;
      color: #5fa4e8;
    }
  }
  .hot-search-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: px2rem(14);
    .hot-search-item {
      flex: 1;
      display: flex;
      padding: px2rem(10) px2rem(10);
      box-sizing: border-box;
      .icon-wrapper {
        flex: 0 0 px2rem(40);
        @include center;
        .icon-book {
          font-size: px2rem(16);
        }
      }
      .hot-search-text-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        .text {
          flex: 1;
          color: #666666;
          font-weight: bold;
          padding-bottom: px2rem(5);
        }
        .num {
          flex: 1;
          color: #b5b5b5;
          font-size: px2rem(12);
        }
      }
    }
  }

}
</style>