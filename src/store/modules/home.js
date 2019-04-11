const home = {
  state: {
    hotSearchScroll : 0,  // 热门搜索的滚动距离
    hotSearchVisiable: false, // 热门搜索组件的显示与否 
    flipCardVisiable: false,   // 翻转卡片的显示与否
  },
  mutations:{
    setHotSearchScroll(state,hotSearchScroll){
      state.hotSearchScroll = hotSearchScroll
    },
    setHotSearchVisiable(state,hotSearchVisiable){
      state.hotSearchVisiable = hotSearchVisiable
    },
    setFlipCardVisiable(state,flipCardVisiable){
      state.flipCardVisiable = flipCardVisiable
    }
  }
}

export default home;