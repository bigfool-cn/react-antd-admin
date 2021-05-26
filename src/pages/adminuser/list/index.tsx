import React, { useRef, FC, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Form, Input, Modal, Tag, Spin, message } from 'antd'
import MyTable from '@/components/MyTable'
import { isAuthorized } from '@/assets/js/publicFunc'
import MySelect from '@/components/MySelect'
import AdminUserApi from '@/api/admin-user'
import { modalLayoutSm5 } from '@/config/layout'
import '../adminuser.less'

interface AdminUser {
  id: number;
  name: string;
  status: number;
  updateTime: string;
  createTime: string;
}

const StatusArr: Array<string> = ['冻结', '正常']

const StatusTagArr: Array<string> = ['gold', 'blue']

const AdminUserList: FC = () => {
  const tableRef: RefType = useRef()
  const history = useHistory()
  const [form] = Form.useForm()
  const { getFieldsValue, resetFields } = form

  const [loading, setLoading] = useState<boolean>(false)
  const [btnLoading, setBtnLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [id, setId] = useState<number>(0)
  const [delIds, setDelIds] = useState<Array<string | number>>([])
  const [delDisabeld, setDelDisabeld] = useState<boolean>(true)

  const addAdminUser = () => {
    history.push('/adminuser/list/add')
  }

  const editAdminUserPwd = (record: AdminUser) => {
    resetFields()
    setVisible(true)
    setId(record.id)
  }

  const cancelModel = () => {
    setVisible(false)
  }

  const editAdminUser = (record: AdminUser) => {
    history.push(`/adminuser/list/edit?id=${record.id}`)
  }

  const onSelectRow = (rowKeys: Array<string | number>) => {
    setDelIds(rowKeys)
    if (rowKeys.length > 0) {
      setDelDisabeld(false)
    } else {
      setDelDisabeld(true)
    }
  }

  const repasswordValidator = (rule, value) => {
    const password = form.getFieldValue('password')
    if (password && password !== value) {
      return Promise.reject(new Error('两次密码输入不一致'))
    }
    return Promise.resolve()
  }

  const delAdminUser = () => {
    setBtnLoading(true)
    AdminUserApi.deleteAdminUser(delIds)
      .then((res: any) => {
        message.success(res.message)
        tableRef.current.update()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleSubmit = () => {
    setLoading(true)
    const submitForm = { ...getFieldsValue() }
    AdminUserApi.updateAdminUserPwd(id, submitForm)
      .then((res: any) => {
        message.success(res.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 搜索栏配置项
  const searchConfigList = [
    {
      key: 'name',
      slot: <Input placeholder="用户名" allowClear />,
      initialValue: ''
    },
    {
      key: 'status',
      slot: (
        <MySelect
          data={[{ name: '正常', key: '1' }, { name: '冻结', key: '0' }]}
          placeholder="状态"
        />
      )
    }
  ]
  const columns = [
    {
      title: '用户名',
      dataIndex: 'name'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: number) => (
        <>
          <Tag color={StatusTagArr[status]}>{StatusArr[status]}</Tag>
        </>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '操作',
      dataIndex: 'operations',
      align: 'center',
      render: (text, record) => (
        <>
          {isAuthorized('adminuser:list:edit') && (
            <div>
              <Button
                className="btn mr-5"
                onClick={() => editAdminUserPwd(record)}
                size="small"
                type="primary"
                danger
              >
                修改密码
              </Button>
              <Button
                className="btn"
                onClick={() => editAdminUser(record)}
                size="small"
                type="primary"
              >
                编辑
              </Button>
            </div>
          )}
        </>
      )
    }
  ]

  const delAdminUserEl = (
    <Button
      className="fr mr-5"
      onClick={delAdminUser}
      type="primary"
      disabled={delDisabeld}
      loading={btnLoading}
      danger
    >
      删除用户
    </Button>
  )

  const addAdminUserEl = (
    <Button className="fr" onClick={addAdminUser} type="primary">
      新增用户
    </Button>
  )

  return (
    <>
      {visible && (
        <Modal
          title="修改密码"
          visible={visible}
          onCancel={cancelModel}
          footer={null}
        >
          <Spin spinning={loading}>
            <Form {...modalLayoutSm5} form={form} onFinish={handleSubmit}>
              <Form.Item
                label="新密码"
                name="password"
                rules={[
                  {
                    required: true,
                    message: '请输入新密码'
                  },
                  {
                    min: 6,
                    message: '新密码长度最少6个字符'
                  }
                ]}
              >
                <Input placeholder="请输入新密码" />
              </Form.Item>
              <Form.Item
                label="确认新密码"
                name="repassword"
                rules={[
                  {
                    required: true,
                    validator: repasswordValidator
                  }
                ]}
              >
                <Input placeholder="请输入确认新密码" />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  xs: { span: 20, offset: 5 },
                  sm: { span: 20, offset: 5 }
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
      {isAuthorized('adminuser:list:add') && addAdminUserEl}
      {isAuthorized('adminuser:list:del') && delAdminUserEl}
      <MyTable
        apiFun={AdminUserApi.getAdminUserList}
        columns={columns}
        ref={tableRef}
        onSelectRow={onSelectRow}
        searchConfigList={searchConfigList}
      />
    </>
  )
}
export default AdminUserList
