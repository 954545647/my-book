<template>
  <div
    class="shelf-item"
    :class="{'item-shadow': data.type==1 || data.type==2}"
    @click="onItemClick(data)"
    ref="bookItem"
  >
    <component
      class="shelf-item-comp"
      :is="item"
      :data="data"
      :class="{isSelected: isEditMode && data.type==2}"
    ></component>
    <!-- 这个是点击编辑后的小图标: 表示是否选中 -->
    <div
      class="icon-selected"
      v-show="isEditMode && data.type === 1"
      :class="{'is-selected': data.selected}"
      ref="iconItem"
    ></div>
  </div>
</template>

<script>
import { storeShelfMixin } from "@/utils/mixin.js";
import book from "./ShelfItemBook";
import category from "./ShelfCategory";
import add from "./ShelfAdd";
import { gotoStoreHome } from "@/utils/store.js";
export default {
  mixins: [storeShelfMixin],
  components: {
    book,
    category,
    add
  },
  computed: {
    item() {
      return this.data.type === 1
        ? book
        : this.data.type === 2
        ? category
        : add;
    }
  },
  data() {
    return {};
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    // 点击图书 分两种情况:
    // 普通状态: 直接跳转到图书详情页
    // 编辑状态: 不跳转,进行编辑操作,弹出底部菜单
    onItemClick(data) {
      // 如果是编辑状态
      if (this.isEditMode) {
        data.selected = !data.selected;
        // 如果是选中状态,把选中的保存进数组中去
        if (data.selected) {
          this.shelfSelected.addWithoutSame(data);
        } else {
          // 如果不是选中状态,就把它从数组中移除
          this.setShelfSelected(
            this.shelfSelected.filter((item, index) => {
              return item.selected !== data.selected;
            })
          );
        }
      } else {
        if (data.type === 1) {
          this.showBookDetail(data);
        } else if (data.type === 2) {
        } else {
          gotoStoreHome(this);
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
.shelf-item {
  position: relative;
  width: 100%;
  height: 100%;
  &.item-shadow {
    box-shadow: px2rem(5) 0 px2rem(5) rgba(200, 200, 200, 0.3);
  }
  .shelf-item-comp {
    opacity: 1;
    &.isSelected {
      opacity: 0.5;
    }
  }
  .icon-selected {
    position: absolute;
    right: px2rem(2);
    bottom: px2rem(2);
    font-size: px2rem(16);
    color: rgba(0, 0, 0, 0.5);
    &.is-selected {
      color: #4aabff;
    }
  }
}
</style>
