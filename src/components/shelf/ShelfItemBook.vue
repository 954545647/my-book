<template>
  <div class="shelf-item-book">
    <img :src="data.cover" alt="" class="shelf-item-book-cover">
  </div>
</template>

<script>
export default {
  props:{
    data:{
      type: Object,
      default: ()=> {}
    }
  }
}
</script>

<style lang="scss">
  .shelf-item-book{
    width: 100%;
    height: 100%;
    .shelf-item-book-cover{
      width: 100%;
      height: 100%;
    }
  }
</style>