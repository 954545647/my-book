<template>
  <transition name="slide-up">
    <div class="theme-wrapper" v-show="menuVisible && settingVisible === 1">
      <div class="theme-box">
        <div
          class="wrapper"
          v-for="(item,index) in themeList"
          :key="index"
          @click="setTheme(item.name)"
        >
          <div
            class="theme"
            :style="{backgroundColor: item.style.body.background}"
            :class="{'has-boder': item.name === defaultTheme}"
          ></div>
          <!-- item.alias是国际化会自动变 -->
          <div class="title" :class="{'select': item.name === defaultTheme } ">{{item.alias}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { bookMixin } from "@/utils/mixin.js";
// import { themeList } from "@/utils/book.js"; //主题列表  //混入了
import { setTheme } from "@/utils/localStorage.js";
export default {
  mixins: [bookMixin],
  computed: {
    // themeList() {
    //   return themeList(this); //传入this是vue实例,因为需要国际化
    // }
  },
  methods: {
    //   设置主题样式
    setTheme(val) {
      // 传进来的是主题的名称,根据名称去改变默认主题值
      this.setDefaultTheme(val).then(() => {
        //   先去修改我们的默认主题,然后再去调用API去渲染主题色
        this.currentBook.rendition.themes.select(this.defaultTheme);
        // 修改全局主题色 通过在 mixin 中获取方法
        this.initGlobalStyle();
      });
      // 把当前选择的主题保存到 localStorage中去
      setTheme(this.fileName, val);
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
@import "../../assets/styles/global.scss";
.theme-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: px2rem(50);
  height: px2rem(90);
  background: #fff;
  .theme-box {
    flex: 1;
    display: flex;
    .wrapper {
      font-size: px2rem(16);
      flex: 1;
      flex-direction: column;
      padding: px2rem(8) px2rem(8) 0 px2rem(8);
      @include center;
      .theme {
        flex: 2;
        width: 100%;
        margin-bottom: px2rem(5);
        border: none;
      }
      .has-boder {
        border: px2rem(2) solid #6e6e6e;
        box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, 0.1);
      }
      .title {
        flex: 0 0 px2rem(20);
        color: #6e6e6e;
      }
      .select {
        color: #000;
      }
    }
  }
}
</style>