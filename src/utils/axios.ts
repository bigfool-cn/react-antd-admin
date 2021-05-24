import Axios from 'axios'
import { message } from 'antd'
import { store } from '@/store'
import { HashRouter } from 'react-router-dom'

interface AxiosConfig {
  baseURL: string;
  timeout: number;
  headers: {
    'Content-Type': string
  };
}

const config: AxiosConfig = {
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json'
  }
}

const axios = Axios.create(config)

const router: CommonObjectType = new HashRouter({})

// token失效，清除用户信息并返回登录界面
const clearAll = () => {
  store.dispatch({
    type: 'SET_USERINFO',
    payload: {}
  })
  router.history.replace({ pathname: '/login' })
}

// 请求前拦截
axios.interceptors.request.use(
  (req) => {
    const { token = '' } = store.getState().storeData.userInfo || {}
    req.headers.Authorization = token
    return req
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 返回后拦截
axios.interceptors.response.use(
  ({ data }): Promise<any> => {
    if (data.code !== 0) {
      message.error(data.message)
      return Promise.reject(data)
    }
    return Promise.resolve(data)
  },
  (err) => {
    message.destroy()
    try {
      if (JSON.stringify(err).includes('401')) {
        clearAll()
        message.error({ title: '提示', content: 'Unauthorized' })
        return Promise.reject(err)
      }
    } catch (error) {
      clearAll()
    }
    message.error('网络异常')
    return Promise.reject(err)
  }
)

// post请求
axios.post = (url: string, params?: object): Promise<any> =>
  axios({
    method: 'post',
    url,
    data: params
  })

// get请求
axios.get = (url: string, params?: object): Promise<any> =>
  axios({
    method: 'get',
    url,
    params
  })

// put请求
axios.put = (url: string, params?: object): Promise<any> =>
  axios({
    method: 'put',
    url,
    data: params
  })

// delete请求
axios.delete = (url: string, params?: object): Promise<any> =>
  axios({
    method: 'delete',
    url,
    data: params
  })

export default axios
