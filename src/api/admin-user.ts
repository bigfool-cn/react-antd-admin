import $axios from '@/utils/axios'

export default {
  getAdminUserList(params?: object): Promise<CommonObjectType<string>> {
    return $axios.get('/adminusers', params)
  },

  getAdminUser(id: number | string): Promise<CommonObjectType<string>> {
    return $axios.get(`/adminusers/${id}`)
  },

  addAdminUser(params: object): Promise<CommonObjectType<string>> {
    return $axios.post('/adminusers', params)
  },

  updateAdminUser(
    id: number | string,
    params: object
  ): Promise<CommonObjectType<string>> {
    return $axios.put(`/adminusers/${id}`, params)
  },

  updateAdminUserPwd(
    id: number,
    params: object
  ): Promise<CommonObjectType<string>> {
    return $axios.put(`/adminusers/pwd/${id}`, params)
  },

  deleteAdminUser(params: object): Promise<CommonObjectType<string>> {
    return $axios.delete('/adminusers', params)
  }
}
