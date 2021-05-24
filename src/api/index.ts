import $axios from '@/utils/axios'

export default {
  // 获取数据
  getList(params?: object): Promise<CommonObjectType<string>> {
    return $axios.get('https://randomuser.me/api', params)
  },

  // 登录
  login(params: object): Promise<CommonObjectType<string>> {
    return $axios.post('/admin/login', params)
  }
}
