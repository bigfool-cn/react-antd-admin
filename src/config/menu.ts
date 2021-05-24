import { HomeOutlined, UserOutlined, AuditOutlined } from '@ant-design/icons'

const menus = [
  {
    path: '/',
    name: '首页',
    key: 'home',
    icon: HomeOutlined,
    routes: []
  },
  {
    path: '/adminuser',
    name: '用户管理',
    key: 'adminuser',
    type: 'subMenu',
    icon: UserOutlined,
    iconfont: 'icon-xiaoshouzongjian',
    routes: [
      {
        path: '/adminuser/list',
        name: '用户列表',
        key: 'adminuser:list:view'
      }
    ]
  },
  {
    path: '/adminpermission',
    name: '权限管理',
    key: 'adminpermission',
    type: 'subMenu',
    icon: AuditOutlined,
    routes: [
      {
        path: '/adminpermission/list',
        name: '权限列表',
        key: 'adminpermission:list:view'
      }
    ]
  }
]

export default menus
