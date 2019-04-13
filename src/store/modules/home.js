const home = {
  state: {
    hotSearchScroll: 0, // 热门搜索的滚动距离
    hotSearchVisiable: false, // 热门搜索组件的显示与否
    flipCardVisiable: false, // 翻转卡片的显示与否
    isEditMode: false, // 是否进入编辑模式
    shelfList: [], // 书架图书列表
    shelfSelected: [], // 书架图书选中列表
    shelfTitleVisible: true, // 书架页面标题的显示状态
    shelfCategory: [], // 书架分类列表数据
    currentType: 1 // 书架列表为1，书架分类列表为2
  },
  mutations: {
    setHotSearchScroll(state, hotSearchScroll) {
      state.hotSearchScroll = hotSearchScroll;
    },
    setHotSearchVisiable(state, hotSearchVisiable) {
      state.hotSearchVisiable = hotSearchVisiable;
    },
    setFlipCardVisiable(state, flipCardVisiable) {
      state.flipCardVisiable = flipCardVisiable;
    },
    SET_IS_EDIT_MODE(state, isEditMode) {
      state.isEditMode = isEditMode;
    },
    SET_SHELF_LIST(state, list) {
      state.shelfList = list;
    },
    SET_SHELF_SELECTED(state, selected) {
      state.shelfSelected = selected;
    },
    SET_SHELF_TITLE_VISIBLE(state, visible) {
      state.shelfTitleVisible = visible;
    },
    SET_SHELF_CATEGORY(state, category) {
      state.shelfCategory = category;
    },
    SET_CURRENT_TYPE(state, type) {
      state.currentType = type;
    }
  }
};

export default home;
