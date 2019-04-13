<template>
  <div class="guess-you-like">
    <div class="home-title-wrapper">
      <div class="lab">{{$t('home.guessYouLike')}}</div>
      <div class="btn" @click="changeBook()">{{$t('home.change')}}</div>
    </div>
    <div class="guess-you-like-list">
      <div
        class="guess-you-like-item"
        v-for="(item,index) in currentData"
        :key="index"
        @click="showBookDetail(item)"
      >
        <div class="img-wrapper">
          <img :src="item.cover" alt :key="item.cover">
        </div>
        <div class="content-wrapper">
          <div class="title">{{item.title}}</div>
          <div class="author">{{item.author}}</div>
          <div class="result">{{item.result}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from "@/utils/mixin.js";
export default {
  mixins: [storeHomeMixin],
  data() {
    return {
      index: 0,
      total: 0
    };
  },
  props: {
    guessData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    changeBook() {
      this.currentData = this.guessData.filter((item, index) => {
        return index < 3;
      });
    }
  },
  computed: {
    currentData: {
      get() {
        return this.guessData.filter((item, index) => {
          return index < 3;
        });
      },
      set(val) {
        // 把传递过来的数据打乱
        this.guessData.sort(() => Math.random() - 0.5);
      }
    }
    // currentData() {
    //   return this.guessData.filter((item, index) => {
    //     return index < 3;
    //   });
    // }
  },

  watch: {},
  mounted() {
    this.$nextTick(() => {});
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
.guess-you-like {
  .home-title-wrapper {
    display: flex;
    padding: px2rem(10) px2rem(10);
    box-sizing: border-box;
    .lab {
      flex: 1;
      font-size: px2rem(18);
      color: #333333;
      font-weight: bold;
    }
    .btn {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      font-size: px2rem(14);
      color: #75b9ff;
    }
  }
  .guess-you-like-list {
    .guess-you-like-item {
      padding: px2rem(0) px2rem(10);
      box-sizing: border-box;
      display: flex;
      .img-wrapper {
        flex: 0 0 px2rem(80);
        width: 100%;
        height: 100%;
        padding: px2rem(10) px2rem(10) px2rem(10) 0;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .content-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: px2rem(10) px2rem(10) px2rem(10) 0;

        .title {
          font-size: px2rem(16);
          line-height: px2rem(16);
          padding-bottom: px2rem(15);
        }
        .author {
          font-size: px2rem(12);
          padding-bottom: px2rem(15);
        }
        .result {
          font-size: px2rem(12);
          color: #b1b1b1;
        }
      }
    }
  }
}
</style>
