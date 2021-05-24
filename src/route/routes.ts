import Home from '@/pages/home'
import ErrorPage from '@/pages/public/errorPage'

import AdminUserList from '@/pages/adminuser/list'
import AdminUserEdit from '@/pages/adminuser/edit'

import AdminPermissionList from '@/pages/adminpermission/list'

/**
 * path 跳转的路径
 * component 对应路径显示的组件
 * exact 匹配规则，true的时候则精确匹配。
 */
const menus = [
  {
    path: '/',
    name: '首页',
    exact: true,
    key: 'home',
    component: Home
  },
  {
    path: '/adminuser',
    name: '用户管理',
    key: 'adminuser',
    routes: [
      {
        path: '/adminuser/list',
        name: '用户列表',
        exact: true,
        key: 'adminuser:list:view',
        component: AdminUserList
      },
      {
        path: '/adminuser/list/add',
        name: '新增用户',
        exact: true,
        key: 'adminuser:list:add',
        component: AdminUserEdit
      },
      {
        path: '/adminuser/list/edit',
        name: '编辑用户',
        exact: true,
        key: 'adminuser:list:edit',
        component: AdminUserEdit
      }
    ]
  },
  {
    path: '/adminpermission',
    name: '权限管理',
    key: 'adminpermission',
    routes: [
      {
        path: '/adminpermission/list',
        name: '权限列表',
        exact: true,
        key: 'adminpermission:list:view',
        component: AdminPermissionList
      }
    ]
  },
  {
    path: '/403',
    name: '暂无权限',
    exact: true,
    key: '/403',
    component: ErrorPage
  }
]

export default menus
