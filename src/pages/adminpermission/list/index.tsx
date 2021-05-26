import React, { FC, useEffect, useRef, useState } from 'react'
import {
  isAuthorized,
  makeTree,
  makeTreeSelectData
} from '@/assets/js/publicFunc'
import {
  Button,
  Table,
  Modal,
  Form,
  Switch,
  Input,
  TreeSelect,
  message,
  Spin
} from 'antd'
import { modalLayoutSm } from '@/config/layout'
import AdminPermissionApi from '@/api/admin-permission.ts'
import SearchForm from '@/components/SearchForm'

interface AdminPermission {
  id: number;
  name: string;
  code: string;
  isHelp: boolean;
  parentId: number;
  updateTime: string;
  createTime: string;
}

const AdminPermissionList: FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [btnLoading, setBtnLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('新增权限')
  const [permissionId, setPermissionId] = useState<number>(0)
  const [permissionList, setPermissionList] = useState<Array<any>>([])
  const [treeSelectList, setTreeSelectList] = useState<Array<any>>([])
  const [form] = Form.useForm()
  const { setFieldsValue, getFieldsValue, resetFields } = form
  const searchForm = useRef()

  const getAdminPermissions = (search: object = {}) => {
    AdminPermissionApi.getAdminPermissions(search).then((res: any) => {
      const permissions = res.data ? res.data : []
      const adminPermissionsTree = makeTree(permissions)
      setPermissionList(adminPermissionsTree)
    })
  }

  const setTreeSelectData = () => {
    const root = [{ value: 0, title: '根所属' }]
    const treeSelectData = root.concat(
      makeTreeSelectData(permissionList, 'id', 'name')
    )
    setTreeSelectList(treeSelectData)
  }

  useEffect(() => {
    getAdminPermissions()
    // eslint-disable-next-line
  }, [])

  const add = () => {
    resetFields()
    setPermissionId(0)
    setVisible(true)
    setTitle('新增权限')
    setFieldsValue({ parentId: 0, code: '' })
    setTreeSelectData()
  }

  const edit = (record: any) => {
    setPermissionId(record.id)
    setFieldsValue({ ...record })
    setVisible(true)
    setTitle('编辑权限')
    setTreeSelectData()
  }

  const handleSearch = (values) => {
    getAdminPermissions(values)
  }

  const cancelModel = () => {
    setVisible(false)
  }

  const delAdminPermission = (record: AdminPermission) => {
    setBtnLoading(true)
    const ids = [record.id]
    AdminPermissionApi.deleteAdminPermission(ids)
      .then((res) => {
        message.success(res.message)
        getAdminPermissions()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleSubmit = () => {
    setLoading(true)
    if (permissionId) {
      AdminPermissionApi.updateAdminPermission(permissionId, getFieldsValue())
        .then((res) => {
          message.success(res.message)
          setVisible(false)
          getAdminPermissions()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      AdminPermissionApi.addAdminPermission(getFieldsValue())
        .then((res) => {
          message.success(res.message)
          setVisible(false)
          getAdminPermissions()
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }
  const AddBtn = () => (
    <Button className="fr" onClick={add} type="primary">
      新增权限
    </Button>
  )
  const columns: any = [
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '权限标识',
      dataIndex: 'code'
    },
    {
      title: '操作',
      dataIndex: 'operations',
      align: 'center',
      render: (text, record) => (
        <>
          {isAuthorized('adminpermission:list:del') && (
            <Button
              className="btn mr-5"
              onClick={() => delAdminPermission(record)}
              size="small"
              type="primary"
              loading={btnLoading}
              danger
            >
              删除
            </Button>
          )}
          {isAuthorized('adminpermission:list:edit') && (
            <Button
              className="btn"
              onClick={() => edit(record)}
              size="small"
              type="primary"
            >
              编辑
            </Button>
          )}
        </>
      )
    }
  ]

  // 搜索栏配置项
  const searchConfigList = [
    {
      key: 'name',
      slot: <Input placeholder="名称" allowClear />,
      initialValue: ''
    }
  ]
  const nameValidator = (rule, value) => {
    if (!value) {
      return Promise.reject(new Error('请输入名称'))
    }
    return Promise.resolve()
  }
  const codeValidator = (rule, value) => {
    const parentId = form.getFieldValue('parentId')
    const isHelp = form.getFieldValue('isHelp')
    if (isHelp) {
      return Promise.resolve()
    }
    if (!parentId && !value) {
      return Promise.reject(new Error('请输入权限标识'))
    }
    if (!parentId && !/^[a-zA-Z0-9:]+$/.test(value)) {
      return Promise.reject(new Error('权限标识格式不正确'))
    }
    return Promise.resolve()
  }
  return (
    <>
      {isAuthorized('adminpermission:list:add') && <AddBtn />}
      {visible && (
        <Modal
          title={title}
          visible={visible}
          onCancel={cancelModel}
          footer={null}
        >
          <Spin spinning={loading}>
            <Form {...modalLayoutSm} form={form} onFinish={handleSubmit}>
              <Form.Item label="所属" name="parentId">
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={treeSelectList}
                  placeholder="请选择"
                />
              </Form.Item>
              <Form.Item label="辅助信息" name="isHelp" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ validator: nameValidator }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
              <Form.Item
                label="权限标识"
                name="code"
                rules={[{ validator: codeValidator }]}
              >
                <Input placeholder="格式(字母数字:组合)：abc:cde" />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  xs: { span: 20, offset: 4 },
                  sm: { span: 20, offset: 4 }
                }}
              >
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      )}
      <SearchForm
        ref={searchForm}
        handleSearch={handleSearch}
        config={searchConfigList}
      />
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={permissionList}
        pagination={false}
      />
    </>
  )
}

export default AdminPermissionList
