<template>
  <div class="shelf-item-category">
    <!-- 九宫格布局 -->
    <div class="shelf-item-category-list">
      <div class="shelf-item-category-item" v-for="(item,index) in currentData" :key="index">
        <img :src="item.cover" alt>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    currentData() {
      if (this.data.itemList.length > 9) {
        return this.data.itemList.filter((item, index) => {
          return index < 9;
        });
      } else {
        return this.data.itemList;
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
@import "../../assets/styles/global";

.shelf-item-category {
  width: 100%;
  height: 100%;
  .shelf-item-category-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row wrap;
    padding-top: px2rem(5);
    box-sizing: border-box;
    .shelf-item-category-item {
      flex: 0 0 33.33%;
      width: 33.33%;
      height: 33.33%;
      box-sizing: border-box;
      &:nth-child(3n+1){
        padding: 0 px2rem(2.5) px2rem(5) px2rem(5);
      }
      &:nth-child(3n+2){
        padding: 0 px2rem(2.5) px2rem(5) px2rem(2.5);
      }
      &:nth-child(3n+3){
        padding: 0 px2rem(5) px2rem(5) px2rem(2.5);
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>