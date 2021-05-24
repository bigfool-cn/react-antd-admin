import $axios from '@/utils/axios'

export default {
  getAdminPermissions(params?: object): Promise<CommonObjectType<string>> {
    return $axios.get('/adminpermissions', params)
  },

  getAdminPermission(id: number | string): Promise<CommonObjectType<string>> {
    return $axios.get(`/adminpermissions/${id}`)
  },

  addAdminPermission(params: object): Promise<CommonObjectType<string>> {
    return $axios.post('/adminpermissions', params)
  },

  updateAdminPermission(
    id: number,
    params: object
  ): Promise<CommonObjectType<string>> {
    return $axios.put(`/adminpermissions/${id}`, params)
  },

  deleteAdminPermission(params: object): Promise<CommonObjectType<string>> {
    return $axios.delete('/adminpermissions', params)
  }
}
