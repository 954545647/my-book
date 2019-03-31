const book = {
  state: {
    age: 53
  },
  mutations: {
    setAge(state, newAge) {
      state.age = newAge;
    }
  },
  actions: {
    setAge({ commit, state }, newAge) {
      return commit("setAge", newAge); // 返回的是一个 Promise对象
    }
  }
};
export default book;
