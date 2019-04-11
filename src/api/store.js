import axios from 'axios';

export function home(){
  // 
  // let data = axios.get('/')
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}