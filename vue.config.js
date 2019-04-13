function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data);
  });
}

const homeData = require('./src/mock/bookHome');
const shelfData = require('./src/mock/bookShelf.js');
const listData = require('./src/mock/bookList');
const BookFlatList = require('./src/mock/bookFlatList');

module.exports = {
  baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
  devServer: {
    // mockjs不支持Blob格式
    // 使用本地调试起的服务
    before(app) {
      mock(app, "/book/home", homeData);
      mock(app, "/book/shelf", shelfData);
      mock(app, "/book/list", listData);
      mock(app, "/book/flat-list", BookFlatList);
    }
  }
};
