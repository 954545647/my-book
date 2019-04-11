<template>
  <div class="reader">
    <div id="read"></div>
    <div
      class="mask"
      @click="changePage"
      @touchmove="move"
      @touchend="moveEnd"
      @mousedown="mouseDown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
    ></div>
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
  setTheme,
  getLocation
} from "@/utils/localStorage.js";
// import { addCss } from "@/utils/book.js";
import { flatten } from "@/utils/book.js";
export default {
  mixins: [bookMixin],
  data() {
    return {
      mouseState: 0
    };
  },
  methods: {
    // pc端鼠标开始点击
    // 1: 鼠标进入 触发mouseDown事件
    // 2: 鼠标进入后的移动(只处理鼠标点击后的移动事件)
    // 3: 鼠标从移动状态松手
    // 4: 鼠标还原
    mouseDown(e) {
      this.mouseState = 1;
      this.mouseStartTime = e.timeStamp;
      e.stopPropagation();
      e.preventDefault();
    },
    mouseMove(e) {
      if (this.mouseState === 1) {
        this.mouseState = 2;
      } else if (this.mouseState === 2) {
        let offsetY = 0;
        // 如果是第二次点击的话
        if (this.preOffsetY) {
          offsetY = e.clientY - this.preOffsetY;
          this.setOffsetY(offsetY); // 保存到vuex中去
        } else {
          this.preOffsetY = e.clientY;
        }
        e.stopPropagation();
        e.preventDefault();
      }
    },
    mouseUp(e) {
      // 处理从状态2过来的事件
      if (this.mouseState === 2) {
        this.setOffsetY(0);
        this.preOffsetY = 0;
        this.mouseState = 3;
      } else {
        // 如果是仅仅点击没有移动的话 鼠标状态任然为 1
        // 将鼠标状态修改为结束状态4
        // 如果不修改其他的值的话(4),那么当我们鼠标点击后不移动我们鼠标此时的状态仍然为1
        // 就会有个问题就是我们以为自己已经松开了,其实状态还是1,那么当我们拖动的时候就会触发状态2的事件,导致面板跟着我们动
        this.mouseState = 4;
      }
      // 这个是处理如果用户不小心点击然后拖动了一下,系统判断状态为 3
      // 这样就会给用户感觉是卡顿,因为用户实质是点击呼出菜单,但是不小心拖动了一下,系统判断状态3为拖拉面板,小距离脱离没有效果
      // 我们强制将状态修改为4 这样就会呼出菜单,让用户有感觉
      let time = e.timeStamp - this.mouseStartTime;
      if (time < 100) {
        this.mouseState = 4;
      }
      e.stopPropagation();
      e.preventDefault();
    },
    // 鼠标移动事件
    move(event) {
      // 初始值为0
      let offsetY = 0;
      // 如果存在上一次移动的值
      // 只关心第一次点击时候的起始位置,用结束位置去减去起始位置
      if (this.preOffsetY) {
        offsetY = event.changedTouches[0].clientY - this.preOffsetY;
        this.setOffsetY(offsetY); // 保存到vuex中去
        // 如果是刚开始移动
      } else {
        this.preOffsetY = event.changedTouches[0].clientY;
      }
      event.preventDefault();
      event.stopPropagation();
    },
    // 鼠标移动事件结束
    moveEnd(e) {
      this.preOffsetY = 0;
      this.setOffsetY(0);
    },
    // 点击翻页
    // 鼠标的点击事件最后会触发这个事件
    changePage(e) {
      // 因为最后会触发蒙版的这个事件,所有需要在最后进行鼠标状态处理
      // 当我们点击鼠标拖动完后,此时的状态为3,我们是想进行拖动面板,所以不需要呼出面板
      // 如果我们仅仅是点击一下没有移动,就可以判断为我们是想要呼出面板
      // 所以对状态 2 和 3 进行过滤
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
        return;
      }
      let offsetX = e.offsetX; // 鼠标点击距离屏幕左右两侧的距离
      let Width = window.innerWidth; //屏幕的大小
      if (offsetX && offsetX < Width * 0.3) {
        this.prevPage();
      } else if (offsetX && offsetX > Width * 0.7) {
        this.nextPage();
      } else {
        this.toggleTitleAndMenu();
      }
    },
    // 上一页
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          // 手动翻页之后也要更新进度条
          this.refreshProgress();
        });
        this.hideMenu();
      }
    },
    // 下一页
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          // 手动翻页之后也要更新进度条
          this.refreshProgress();
        });
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
    // 隐藏菜单栏,在执行下一页的时候进行隐藏  移入 mixin
    // hideMenu() {
    //   // this.$store.dispatch("setmenuVisible", false);
    //   this.setSettingVisible(-1);
    //   this.setmenuVisible(false);
    //   this.setFontFamilyVisible(false);
    // },
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
    //
    // display(target) {  自定义display
    //   if (target) {
    //     return this.rendition.display(target);
    //   } else {
    //     return this.rendition.display();
    //   }
    // },

    // 初始化Book对象还有字体文件
    initRendition() {
      //   将Book对象渲染到页面
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        height: innerHeight,
        methods: "default"
        // 还有滚动模式 但是微信不支持
        // flow : 'scroll'
      });

      //   展示到页面上
      // 使用book对象原生的 display()方法
      // this.rendition.display().then(() => {
      //   this.initTheme();
      //   this.initFontSize();
      //   this.initFontFamily();
      //   this.initGlobalStyle();
      // });

      // 使用自定义的 display()方法
      let target = getLocation(this.fileName);
      this.display(target, () => {
        this.initTheme();
        this.initFontSize();
        this.initFontFamily();
        this.initGlobalStyle();
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
    },

    //   手势 epubjs是在iframe上进行操作的,可以通过 this.rendition将事件绑定到iframe上
    initGesture() {
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
    },

    // 解析书籍内容 封面标题作者信息等
    initParseBook() {
      // loaded表示电子书正在加载 cover表示获取封面信息
      this.book.loaded.cover.then(cover => {
        if (cover) {
          // 通过封面cover图片转换成url,并保存到 localStorage中去
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url); // 保存进 vuex 中去
          });
        }
        this.setCover("http://localhost:8081/404.jpg");
      });
      // 获取标题和作者信息
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata);
      });
      // 获取目录信息
      this.book.loaded.navigation.then(con => {
        // 对目录信息进行扁平化处理
        let navItem = flatten(con.toc);
        navItem.forEach(item => {
          // 把目录的每一项进行设置层级
          item.level = setLevel(item);
        });
        function setLevel(item, level = 0) {
          // 如果传递进来的没有 parent属性,证明是一级标题,层级为0
          if (!item.parent) {
            return level;
          } else {
            // 如果有 parent 属性,那么我们需要获取到这个元素
            return setLevel(
              // 进行递归调用
              navItem.filter(parentItem => parentItem.id === item.parent)[0],
              ++level
            );
          }
        }
        // 把处理后的 目录信息 保存到 vuex 中
        this.setNavigation(navItem);
      });
    },

    // 初始化电子书
    initBook(name) {
      //  获取资源路径
      const url = "http://127.0.0.1:8081/epub/" + name + ".epub";
      //   实例化一个 Book对象
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      this.initRendition();
      // this.initGesture();
      this.initParseBook();
      // ready是在 book 全部解析完成后调用
      this.book.ready.then(() => {
        // 分页: 一页显示的文字数
        return this.book.locations
          .generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          )
          .then(locations => {
            // locations分页信息 this.navigation目录信息
            // 给每个目录初始化一个数组,里面用来存放相应的章节信息
            this.navigation.forEach(nav => {
              nav.pageList = [];
            });
            locations.forEach(item => {
              // 遍历得到的分页信息去和我们的目录信息进行对比,看是属于哪一个目录
              let loc = item.match(/\[(.*)\]!/)[1];
              this.navigation.forEach(nav => {
                if (nav.href) {
                  let href = nav.href.match(/(.*)\.xhtml/)
                    ? nav.href.match(/(.*)\.xhtml/)[1]
                    : "";
                  let href2 = nav.href.match(/(.*)\.html/)
                    ? nav.href.match(/(.*)\.html/)[1]
                    : "";
                  // 如果某一分页属于某一目录
                  if (href === loc || href2 === loc) {
                    nav.pageList.push(item);
                  }
                }
              });
              // 给目录信息添加分页信息,即每一章从第几页
              let currentPage = 1;
              // 在上面已经给每一章节添加了一个pageList代表章节下有多少页
              this.navigation.forEach((nav, index) => {
                if (index === 0) {
                  nav.page = 1;
                } else {
                  nav.page = currentPage;
                }
                // 当前页为 pageList的长度 + 1
                currentPage += nav.pageList.length + 1;
              });
            });
            this.setBookAvailable(true); // 书籍加载完成
            this.refreshProgress();
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
.reader {
  #read {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .mask {
    width: 100%;
    height: 100%;
    z-index: 0;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
