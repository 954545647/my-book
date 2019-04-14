<template>
  <transition name="fade">
    <div class="shelf-title" v-if="shelfTitleVisible">
      <div class="shelf-title-text-wrapper">
        <div class="shelf-title-text">{{$t('shelf.title')}}</div>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left">
        <div class="shelf-title-btn-text" @click.stop="clearCache()">{{$t('shelf.clearCache')}}</div>
      </div>
      <!-- 编辑按钮 -->
      <div class="shelf-title-btn-wrapper shelf-title-right">
        <span
          class="shelf-title-btn-text"
          @click="onEditClick"
        >{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { storeShelfMixin } from "@/utils/mixin.js";
import { deleteLocalStorage } from "@/utils/localStorage.js";
import { clearLocalForage } from "@/utils/localForage.js";
import { shelf } from "@/api/store.js"; //这个是通过接口获取数据的!
import { AddToShelf } from "@/utils/store.js";
import { getBookShelf, saveBookShelf } from "@/utils/localStorage.js";
export default {
  mixins: [storeShelfMixin],
  computed: {
    selectedText() {
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0;
      return selectedNumber <= 0
        ? this.$t("shelf.selectBook")
        : selectedNumber === 1
        ? this.$t("shelf.haveSelectedBook").replace("$1", selectedNumber)
        : this.$t("shelf.haveSelectedBooks").replace("$1", selectedNumber);
    }
  },
  methods: {
    onEditClick() {
      // 如果不是编辑状态
      if (!this.isEditMode) {
        // 设置选中的数组列表为空
        this.setShelfSelected([]);
        // 把选中状态全部重置为 false shelfList中是每本图书的信息,包括selected属性
        this.shelfList.forEach(item => {
          item.selected = false;
          if (item.itemList) {
            item.itemList.forEach(subItem => {
              subItem.selected = false;
            });
          }
        });
      }
      this.setIsEditMode(!this.isEditMode);
    },
    // 清除缓存
    clearCache() {
      // 清空 localStorage 和 localForage
      deleteLocalStorage();
      clearLocalForage();
      this.setShelfSelected([]); // 设置选中集合为空
      this.setShelfList([]); // 设置源数据集合为空
      // 接着再通过接口获取数据
      shelf().then(res => {
        if (res && res.data && res.data.bookList) {
          let shelfList = AddToShelf(res.data.bookList); //新增一个type为3的数据
          saveBookShelf(shelfList); //保存到localStorage中去
          this.setShelfList(shelfList); //保存到vuex中去
        }
      });
      this.simpleToast(this.$t("shelf.clearCacheSuccess"));
    }
  }
};
</script>


<style lang="scss">
@import "@/assets/styles/global.scss";
.shelf-title {
  position: relative;
  z-index: 130;
  width: 100%;
  height: px2rem(42);
  background: white;
  // box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  // &.hide-shadow {
  //   box-shadow: none;
  // }
  .shelf-title-text-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .shelf-title-text {
      font-size: px2rem(16);
      line-height: px2rem(20);
      font-weight: bold;
      color: #333;
    }
    .shelf-title-sub-text {
      font-size: px2rem(10);
      color: #333;
    }
  }
  .shelf-title-btn-wrapper {
    position: absolute;
    top: 0;
    box-sizing: border-box;
    height: 100%;
    @include center;
    .shelf-title-btn-text {
      font-size: px2rem(14);
      color: #666;
    }
    .icon-back {
      font-size: px2rem(20);
      color: #666;
    }
    &.shelf-title-left {
      left: 0;
      padding-left: px2rem(15);
    }
    &.shelf-title-right {
      right: 0;
      padding-right: px2rem(15);
    }
  }
}
</style>