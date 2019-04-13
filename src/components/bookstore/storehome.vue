<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flip-card :randomBook="randomBook"></flip-card>
    <!-- 由于我们在 scroll 组件在滚动的时候可以触发scroll方法-->
    <!-- 在子组件中触发到父组件中去 this.$emit("onScroll", offsetY)-->

    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <img :src="bannerImg" alt>
      </div>
      <guess-you-like :guessData="guessData">
      </guess-you-like>
    </scroll>
  </div>
</template>


<script>
import SearchBar from "./searchBar";
import Scroll from "../Common/Scroll";
import FlipCard from "./FlipCard.vue";
import { storeHomeMixin } from "@/utils/mixin.js";
import { home, coverImg } from "@/api/store.js"; // axios方法
import "swiper/dist/css/swiper.css";
import GuessYouLike from "./guessUlike.vue";
export default {
  mixins: [storeHomeMixin],
  data() {
    return {
      scrollTop: 98,
      randomBook: {},
      bannerImg: null, // 封面图片
      guessData: []
    };
  },
  components: {
    SearchBar,
    Scroll,
    FlipCard,
    GuessYouLike
  },
  methods: {
    onScroll(val) {
      this.setOffsetY(val);
      if (val > 0) {
        this.scrollTop = 56;
      } else if (val === 0) {
        this.scrollTop = 98;
      }
      this.$refs.scroll.refresh();
    },
    callback() {}
  },
  mounted() {
    home().then(res => {
      if (res && res.status === 200) {
        let data = res.data.random;
        // 根据mock数据 随机生成一本书传递到我们的子组件中去
        let num = Math.floor(Math.random() * data.length);
        this.randomBook = data[num];
        this.bannerImg = res.data.banner;
        this.guessData = res.data.guessYouLike;
      }
    });
  }
};
</script>


<style lang="scss">
@import "@/assets/styles/global.scss";

.store-home {
  width: 100%;
  height: 100%;
  .banner-wrapper {
    padding: px2rem(10) px2rem(10);
    box-sizing: border-box;
    img {
      width: 100%;
      height: px2rem(150);
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
}
</style>