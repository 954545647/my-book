import { mapGetters, mapActions } from "vuex";
import { themeList, addCss, removeCss } from "@/utils/book.js"; //主题列表
import { setLocation, getReadTime } from "@/utils/localStorage.js";
import { getBookmark } from "./localStorage";
import { gotoBookDetail } from "./store";

export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      "isEditMode",
      "shelfList",
      "shelfSelected",
      "shelfTitleVisible",
      "offsetY",
      "shelfCategory",
      "currentType"
    ])
  },
  methods: {
    ...mapActions([
      "setIsEditMode",
      "setShelfList",
      "setShelfSelected",
      "setShelfTitleVisible",
      "setOffsetY",
      "setShelfCategory",
      "setCurrentType"
    ]),
    showBookDetail(book) {
      gotoBookDetail(this, book);
    },
    getCategoryList(title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(
          book => book.type === 2 && book.title === title
        )[0];
        this.setShelfCategory(categoryList);
      });
    },
    getShelfList() {
      let shelfList = getBookShelf();
      if (!shelfList) {
        shelf().then(response => {
          if (
            response.status === 200 &&
            response.data &&
            response.data.bookList
          ) {
            shelfList = appendAddToShelf(response.data.bookList);
            saveBookShelf(shelfList);
            return this.setShelfList(shelfList);
          }
        });
      } else {
        return this.setShelfList(shelfList);
      }
    },
    moveOutOfGroup(f) {
      this.setShelfList(
        this.shelfList.map(book => {
          if (book.type === 2 && book.itemList) {
            book.itemList = book.itemList.filter(subBook => !subBook.selected);
          }
          return book;
        })
      ).then(() => {
        const list = computeId(
          appendAddToShelf(
            [].concat(removeAddFromShelf(this.shelfList), ...this.shelfSelected)
          )
        );
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t("shelf.moveBookOutSuccess"));
          if (f) f();
        });
      });
    }
  }
};

export const bookMixin = {
  computed: {
    ...mapGetters([
      "fileName",
      "menuVisible",
      "settingVisible",
      "defaultFontSize",
      "defaultFontFamily",
      "fontFamilyVisible",
      "defaultTheme",
      "bookAvailable", // 书籍加载完毕
      "progress", // 阅读进度条
      "section", // 章节数
      "isPaginating",
      "currentBook",
      "navigation", //目录信息
      "cover", // 封面信息
      "metadata", // 作者和标题信息
      "paginate",
      "pagelist",
      "offsetY", // $refs.book 向下偏移的量
      "isBookmark", // 是否是书签
      "speakingIconBottom",
      "bookdata"
    ]),
    themeList() {
      return themeList(this); //传入this是vue实例,因为需要国际化
    }
  },
  methods: {
    ...mapActions([
      "setFileName",
      "setmenuVisible",
      "setSettingVisible",
      "setdefaultFontSize",
      "setDefaultFontFamily",
      "setFontFamilyVisible",
      "setDefaultTheme",
      "setBookAvailable",
      "setProgress",
      "setSection",
      "setIsPaginating",
      "setCurrentBook",
      "setNavigation",
      "setCover",
      "setMetadata",
      "setPaginate",
      "setPagelist",
      "setOffsetY",
      "setIsBookmark",
      "setSpeakingIconBottom",
      "setBookMark"
    ]),
    initGlobalStyle() {
      // 在初始化之前先删除全部样式
      removeCss();
      let type = this.defaultTheme;
      addCss(`${process.env.VUE_APP_Resource_Url}/theme/theme_${type}.css`);
    },
    refreshProgress() {
      // 获取 currentLocation 对象
      // 里面包含的内容有:
      // cfi定位符,
      // displayed对象: 中有 page(当前页数) total(该章节一共的页数)
      // index: 章节的序号
      // location: 是根据我们自己的分页算法算出来的页数
      let currentLocation = this.currentBook.rendition.currentLocation();
      // 通过 cfi 获取本章的开始位置,传入 percentageFromCfi 获取进度百分比
      // let progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi);
      if (currentLocation && currentLocation.start) {
        let startCfi = currentLocation.start.cfi; // 开头的定位
        this.setProgress(Math.floor(currentLocation.start.percentage * 100));
        this.setSection(currentLocation.start.index); //更新session信息
        setLocation(this.fileName, startCfi);
      }
      // 在我们每次翻页获取拖动进度条的时候都需要进行判断 是否是书签页
      let bookmarks = getBookmark(this.fileName);
      // 如果现有书签数组中存在一个和当前cfi值一样的话,那么就返回true
      if (bookmarks) {
        if (currentLocation && currentLocation.start) {
          let data = bookmarks.some(item => {
            return item.cfi == currentLocation.start.cfi;
          });
          if (data) {
            this.setIsBookmark(true);
          } else {
            this.setIsBookmark(false);
          }
        }
      }
    },
    //  自定义的display方法
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshProgress();
          if (cb) cb();
        });
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshProgress();
          if (cb) cb();
        });
      }
    },
    // 隐藏菜单栏
    hideMenu() {
      this.setSettingVisible(-1);
      this.setmenuVisible(false);
      this.setFontFamilyVisible(false);
    },
    // 获取阅读时间
    getReadTimeText() {
      return this.$t("book.haveRead").replace("$1", this.getReadTimeToMin());
    },
    // 把时间转换为分钟
    getReadTimeToMin() {
      let readTime = getReadTime(this.fileName);
      if (!readTime) {
        return 0;
      } else {
        return Math.ceil(readTime / 60);
      }
    }
  }
};

export const storeHomeMixin = {
  // 首先是 getters.js 文件
  // offsetY: state => state.book.offsetY
  // 然后将这些属性混入到 computed中
  computed: {
    ...mapGetters([
      "offsetY",
      "hotSearchScroll",
      "hotSearchVisiable",
      "flipCardVisiable"
    ])
  },
  methods: {
    // 将actions混入到methods中
    ...mapActions([
      "setOffsetY",
      "setHotSearchVisiable",
      "setHotSearchScroll",
      "setFlipCardVisiable"
    ]),
    showBookDetail(book) {
      this.$router.push({
        path: "/store/detail",
        query: {
          fileName: book.fileName,
          category: book.categoryText
        }
      });
    }
  }
};



// 只有不想同的元素才会被添加进数组中去
Array.prototype.addWithoutSame = function() {
  for (var i = 0; i < arguments.length; i++) {
    let arr = arguments[i];
    // 这里的this代表我们调用的对象
    if (this.indexOf(arr) === -1) {
      // 如果在之前的数组中不存在当前项,就把当前项push进调用对象中去
      this.push(arr);
    }
  }
};
