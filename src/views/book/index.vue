<template>
  <div id="book">
    <book-title></book-title>
    <reader></reader>
    <book-menu></book-menu>
  </div>
</template>

<script>
import reader from "./../../components/book/reader";
import BookTitle from "./../../components/book/title.vue";
import BookMenu from "./../../components/book/menu.vue";
export default {
  components: {
    reader,
    BookTitle,
    BookMenu
  }
};
</script>

<style lang="scss" scoped>
@import "./../../assets/styles/global.scss";
</style>

