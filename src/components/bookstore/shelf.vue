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
import { shelf } from "@/api/store.js"; //这个是通过接口获取数据的!
import { AddToShelf } from "@/utils/store.js";
import { getBookShelf,saveBookShelf } from "@/utils/localStorage.js";
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
    // 由于在编辑模式下会弹出一个菜单栏会遮蔽底部
    // 所以要让我们的 scroll 组件的底部滚动变成 48,这样就可以把最后的内容滚动看到
    isEditMode(isEditMode) {
      this.scrollBottom = this.isEditMode ? 48 : 0;
      this.$nextTick(() => {
        // 需要等DOM加载完才去重新渲染
        this.$refs.scroll.refresh(); //重新计算滚动条的高度
      });
    }
  },
  data() {
    return {
      scrollBottom: 0
    };
  },
  methods: {
    // 获取图片列表数据
    getShelfList() {
      // 先去localStorage中获取数据,没有的话才去请求接口
      let shelfList = getBookShelf();
      if (shelfList) {
        // 如果localStorage中存在的话就将它保存进vuex中
        this.setShelfList(shelfList);
      } else {
        shelf().then(res => {
          if (res && res.data && res.data.bookList) {
            // 调用 vuex 中的方法保存mock数据
            // 直接往从接口得到的数据末尾增加一个type类型为 3 的数据
            shelfList = AddToShelf(res.data.bookList);
            saveBookShelf(shelfList); //保存到localStorage中去
            this.setShelfList(shelfList);//保存到vuex中去
          }
        });
      }
    },
    onScroll(offsetY) {
      // console.log(offsetY)
    }
  },
  mounted() {
    this.getShelfList();
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