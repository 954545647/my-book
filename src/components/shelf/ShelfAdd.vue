<template>
  <div class="self-item-add">
    <span class="icon-add"></span>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "../../assets/styles/global";
.self-item-add {
  width: 100%;
  height: 100%;
  border: px2rem(1) solid #ccc;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  .icon-add {
    font-size: px2rem(40);
    color: #ccc;
  }
}
</style>