import Mock from 'mockjs'
import home from './bookHome';  // 首页数据
import BookShelf from './bookShelf'  // 书架数据
import BookList from './bookList'   // 图书列表数据
import BookFlatList from './bookFlatList' // 方便查询
import BookCoverImg from './bookCoverImg.js';
// Mock.mock( rurl, rtype, template )
// 第一个参数是匹配请求的url 第二个参数是请求的类型 第三个参数是数据模版
Mock.mock(/\/book\/home/, 'get', home)
Mock.mock(/\/book\/shelf/, 'get', BookShelf)
Mock.mock(/\/book\/list/, 'get', BookList)
Mock.mock(/\/book\/flat-list/, 'get', BookFlatList)
Mock.mock(/\/book\/bookImgs/, 'get', BookCoverImg)
// Mock.setup({
//   timeout: '350-600'
// })
// export default Mock


