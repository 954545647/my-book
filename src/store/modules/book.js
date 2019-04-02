const book = {
  state: {
    fileName: "", // 文件名称
    menuVisible: false, // 菜单栏显示与否
    // 菜单主题线束  -1:不显示; 0:字号; 1:主题; 2:进度条; 3:目录
    settingVisible: -1, 
    defaultFontSize: 16,  // 默认字体大小
    defaultFontFamily: "Default", // 默认字体类型
    fontFamilyVisible: false, // 字体菜单显示与否
    defaultTheme: "Default",
    bookAvailable: false,
    progress: 0,
    section: 0,
    isPaginating: true,
    currentBook: null,  // 当前book实例对象
    navigation: null,
    cover: null,
    metadata: null,
    paginate: "",
    pagelist: null,
    offsetY: 0,
    isBookmark: null,
    // speakingIconBottom: realPx(58)
  },
  mutations: {
    // 设置电子书的路径名
    setFileName(state, newFile) {
      state.fileName = newFile;
    },
    // 设置菜单栏的显示或者隐藏
    setmenuVisible(state, menuVisible) {
      state.menuVisible = menuVisible;
    },
    setSettingVisible(state, settingVisible) {
      state.settingVisible = settingVisible;
    },
    setdefaultFontSize(state, defaultFontSize) {
      state.defaultFontSize = defaultFontSize;
    },
    SET_DEFAULT_FONT_FAMILY: (state, font) => {
      state.defaultFontFamily = font;
    },
    SET_FONT_FAMILY_VISIBLE: (state, visible) => {
      state.fontFamilyVisible = visible;
    },
    SET_DEFAULT_THEME: (state, theme) => {
      state.defaultTheme = theme;
    },
    SET_BOOK_AVAILABLE: (state, bookAvailable) => {
      state.bookAvailable = bookAvailable;
    },
    SET_PROGRESS: (state, progress) => {
      state.progress = progress;
    },
    SET_SECTION: (state, section) => {
      state.section = section;
    },
    SET_IS_PAGINATING: (state, isPaginating) => {
      state.isPaginating = isPaginating;
    },
    SET_CURRENT_BOOK: (state, currentBook) => {
      state.currentBook = currentBook;
    },
    SET_NAVIGATION: (state, navigation) => {
      state.navigation = navigation;
    },
    SET_COVER: (state, cover) => {
      state.cover = cover;
    },
    SET_METADATA: (state, metadata) => {
      state.metadata = metadata;
    },
    SET_PAGINATE: (state, paginate) => {
      state.paginate = paginate;
    },
    SET_PAGELIST: (state, pagelist) => {
      state.pagelist = pagelist;
    },
    SET_OFFSETY: (state, offsetY) => {
      state.offsetY = offsetY;
    },
    SET_IS_BOOKMARK: (state, isBookmark) => {
      state.isBookmark = isBookmark;
    },
    SET_SPEAKING_ICON_BOTTOM: (state, speakingIconBottom) => {
      state.speakingIconBottom = speakingIconBottom;
    }
  }
};
export default book;
