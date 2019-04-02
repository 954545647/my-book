<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {

}
// 当 DOMContentLoaded 事件触发时，仅当DOM加载完成，不包括样式表，图片，flash
// 当 onload 事件触发时，页面上所有的DOM，样式表，脚本，图片，flash都已经加载完成了
document.addEventListener('DOMContentLoaded',()=>{
  let html = document.querySelector('html');
  let fontSize = window.innerWidth / 10;
  fontSize = fontSize > 50 ? 50 : fontSize;
  html.style.fontSize = fontSize + 'px';
})
</script>


<style lang="scss">
#app{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
