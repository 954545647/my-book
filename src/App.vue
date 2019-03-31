<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// mapGetters 是辅助函数
import {mapGetters} from 'vuex'
const getters = {
    a: () => 1,
    b: () => 2
}
function fn(keys){
    let data = {}
    keys.forEach((key)=>{
        if(getters.hasOwnProperty(key)){
            data[key] = getters[key]
        }
    })
    return data
}
export default {
  computed: {
    ...mapGetters(['age']),
    ...fn(['a','b'])
  },
  mounted(){
    this.$store.dispatch('setAge',20).then(()=>{
       console.log(this.$store.state.book.age)
       console.log(this.$store.getters.age)
       console.log(this.age)
       console.log(this.a,this.b)
    })
  }
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
</style>
