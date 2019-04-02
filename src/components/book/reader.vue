<template>
  <div class="reader">
    <div id="read"></div>
  </div>
</template>


<script>
import Epub from "epubjs";
global.ePub = Epub;
import { bookMixin } from "@/utils/mixin.js";
import {
  getFontSize,
  getFontFamily,
  setFontSize,
  setFontFamily,
  getTheme,
  setTheme
} from "@/utils/localStorage.js";
// import { addCss } from "@/utils/book.js";
export default {
  mixins: [bookMixin],
  methods: {
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
        this.hideMenu();
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
        this.hideMenu();
      }
    },
    // 切换菜单栏
    toggleTitleAndMenu() {
      // this.$store.dispatch("setmenuVisible", !this.menuVisible);
      if (this.menuVisible) {
        this.setSettingVisible(-1); //隐藏设置菜单栏
        this.setFontFamilyVisible(false);
      }
      this.setmenuVisible(!this.menuVisible);
    },
    // 隐藏菜单栏,在执行下一页的时候进行隐藏
    hideMenu() {
      // this.$store.dispatch("setmenuVisible", false);
      this.setSettingVisible(-1);
      this.setmenuVisible(false);
      this.setFontFamilyVisible(false);
    },
    // 初始化字体类型
    initFontFamily() {
      // 初始化 localStorage 中的数据
      let font = getFontFamily(this.fileName);
      if (!font) {
        // 初始化的时候如果获取不到localStorage中保存的字体类型,就用默认的
        setFontFamily(this.fileName, this.defaultFontFamily);
      } else {
        // 初始化的时候如果存在本地存储,就按本地存储的字体进行渲染并且设置默认字体
        this.rendition.themes.font(font);
        this.setDefaultFontFamily(font);
      }
    },
    // 初始化字体大小
    initFontSize() {
      let fontsize = getFontSize(this.fileName);
      if (!fontsize) {
        setFontSize(this.fileName, this.defaultFontSize);
        this.currentBook.rendition.themes.fontSize(this.defaultFontSize + "px");
      } else {
        this.setdefaultFontSize(fontsize);
        setFontSize(this.fileName, fontsize);
        this.currentBook.rendition.themes.fontSize(fontsize + "px");
      }
    },
    // 初始化主题
    initTheme() {
      // 初始化 localStorage 中的值
      let defaultThemeName = getTheme(this.fileName);
      if (!defaultThemeName) {
        defaultThemeName = this.themeList[0].name;
        setTheme(this.fileName, defaultThemeName);
      }
      this.setDefaultTheme(defaultThemeName);

      // 主题的初始化不一样:先是给 iframe 注册我们所有的主题色
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style);
      });
      // 选择一个默认的主题色
      this.rendition.themes.select(defaultThemeName);
    },
    // 初始化全局主题样式 提取到 mixin 中去
    // initGlobalStyle() {
    //   let type = getTheme(this.fileName);
    //   if (!type) {
    //     type = this.defaultTheme;
    //   }
    //   addCss(`${process.env.VUE_APP_Resource_Url}/theme/theme_${type}.css`);
    // },
    initBook(name) {
      //  获取资源路径
      const url = "http://127.0.0.1:8081/epub/" + name + ".epub";
      //   实例化一个 Book对象
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      //   将Book对象渲染到页面
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        height: innerHeight
      });
      //   展示到页面上
      this.rendition.display().then(() => {
        this.initTheme();
        this.initFontSize();
        this.initFontFamily();
        this.initGlobalStyle();
      });
      //   手势 epubjs是在iframe上进行操作的,可以通过 this.rendition将事件绑定到iframe上
      //   开始触摸
      this.rendition.on("touchstart", event => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.timeStamp = event.timeStamp;
      });
      //   结束触摸
      this.rendition.on("touchend", event => {
        let offsetX = event.changedTouches[0].clientX - this.touchStartX;
        let time = event.timeStamp - this.timeStamp;
        if (time < 500 && offsetX > 40) {
          this.prevPage();
        } else if (time < 500 && offsetX < -40) {
          this.nextPage();
        } else {
          this.toggleTitleAndMenu();
        }
        // event.preventDefault(); // 禁止默认事件
        event.stopPropagation(); // 取消冒泡
      });
      // 把 字体文件注入到我们的 iframe的DOM 中
      this.rendition.hooks.content.register(contents => {
        // 这个contents对象添加静态资源需要是 src 路径
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_Resource_Url}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_Resource_Url}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_Resource_Url}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_Resource_Url}/fonts/tangerine.css`
          )
        ]).then(() => {
          // console.log(process.env.VUE_APP_Resource_Url);
        });
      });
    }
  },
  mounted() {
    //  通过动态路由获取电子书的路径
    const filename = this.$route.params.fileName.split("|").join("/");
    // 存放到 vuex 中 我们在vuex中的actions返回的是一个 Promise对象性
    // this.$store.dispatch("setFileName", filename).then(() => {
    //   this.initBook(this.fileName);
    // });
    // 使用 mixin 和 抽离 mapActions 的方法
    this.setFileName(filename).then(() => {
      this.initBook(this.fileName);
    });
  }
};
</script>


<style lang="scss" scoped>
@import "./../../assets/styles/global.scss";
</style>
