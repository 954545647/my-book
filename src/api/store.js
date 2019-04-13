import axios from 'axios';

// 首页信息
export function home(){
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}
// 图片封面信息
export function coverImg(){
  let data = axios.get(`${process.env.VUE_APP_BASE_URL}/book/bookImgs`)
  return data;
}

// 获取线上图书详情数据
export function detail(book){
  return axios({
    method:'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params:{
      fileName: book.fileName
    }
  })
}

// 获取图书列表数据
export function list(){
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

// 获取书架数据
export function shelf(){
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}