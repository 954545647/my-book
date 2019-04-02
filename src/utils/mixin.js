import { mapGetters, mapActions } from "vuex";
import { themeList,addCss,removeCss } from "@/utils/book.js"; //主题列表

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
      "bookAvailable",
      "progress",
      "section",
      "isPaginating",
      "currentBook",
      "navigation",
      "cover",
      "metadata",
      "paginate",
      "pagelist",
      "offsetY",
      "isBookmark",
      "speakingIconBottom"
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
      "setSpeakingIconBottom"
    ]),
    initGlobalStyle() {
      // 在初始化之前先删除全部样式
      removeCss();
      let type = this.defaultTheme
      addCss(`${process.env.VUE_APP_Resource_Url}/theme/theme_${type}.css`);
    }
  }
};
