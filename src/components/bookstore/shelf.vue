<template>
  <div class="store-shelf">
    <shelf-title></shelf-title>
    <!-- 这里的 onScroll是触发滚动条组件的方法  -->
    <scroll
      class="store-shelf-scroll-wrapper"
      :top="42"
      :bottom="scrollBottom"
      @onScroll="onScroll"
      ref="scroll"
    >
      <shelf-search></shelf-search>
      <shelf-list></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
import ShelfTitle from "@/components/shelf/ShelfTitle.vue";
import { storeShelfMixin } from "@/utils/mixin.js";
import Scroll from "@/components/Common/Scroll";
import ShelfSearch from "@/components/shelf/ShelfSearch.vue";
import ShelfList from "@/components/shelf/ShelfList.vue";
import ShelfFooter from "@/components/shelf/ShelfFooter.vue";
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
    ShelfFooter
  },
  watch: {
    isEditMode(isEditMode) {
      this.scrollBottom = this.isEditMode ? 48 : 0;
      this.$nextTick(()=>{
        // 需要等DOM加载完才去重新渲染
        this.$refs.scroll.refresh();
      })
    }
  },
  data() {
    return {
      scrollBottom: 0
    };
  },
  methods: {
    onScroll(offsetY) {
      // console.log(offsetY)
    }
  }
};
</script>


<style lang="scss">
@import "@/assets/styles/global.scss";
.store-shelf {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 100;
  .store-shelf-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }
}
</style>