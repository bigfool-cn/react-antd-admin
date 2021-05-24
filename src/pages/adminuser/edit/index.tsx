import React, { useState, FC, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, message, Spin, Tree } from 'antd'
import { formItemLayout, wrapperCol } from '@/config/layout'
import {
  closeTabAction,
  getQuery,
  makeTree,
  makeTreeData,
  treeFindParentById,
  diffArray
} from '@/assets/js/publicFunc'
import MySelect from '@/components/MySelect'
import AdminUserApi from '@/api/admin-user'
import AdminPermissionApi from '@/api/admin-permission'

const FormView: FC = () => {
  const query = getQuery()
  const { id } = query

  // 原始权限tree
  let originalTreeData: Array<any> = []

  const [form] = Form.useForm()
  const { setFieldsValue, getFieldsValue, resetFields } = form

  const [loading, setLoading] = useState<boolean>(false)
  const [treeData, setTreeData] = useState<Array<any>>([])
  const [checkedKeys, setCheckedKeys] = useState<Array<number | string>>([])

  const history: CommonObjectType = useHistory()

  // 获取权限列表数据
  const getPermissions = async () => {
    await AdminPermissionApi.getAdminPermissions().then((res: any) => {
      const data: Array<any> = res?.data ? res.data : []
      originalTreeData = makeTree(data)
      const treeDataTemp = makeTreeData(originalTreeData, 'id', 'name')
      setTreeData(treeDataTemp)
    })
  }

  useEffect(() => {
    resetFields()

    getPermissions()

    if (id) {
      AdminUserApi.getAdminUser(id).then((res) => {
        const data: any = res?.data ? res.data : {}
        const adminUsers = data?.adminUser ? data.adminUser : {}
        const permissions = data?.permissions ? data.permissions : []
        const permissionIds = permissions.map((item) => {
          return item.permissionId
        })

        // tree父子受控回显需要过滤掉父级ID
        let parents: Array<number | string> = []

        permissionIds.forEach((item: number | string) => {
          const temp: Array<number | string> = treeFindParentById(
            originalTreeData,
            item
          )
          parents = parents.concat(temp)
        })

        const checkIds: Array<number | string> = diffArray(
          permissionIds,
          parents
        )
        setCheckedKeys(checkIds)

        adminUsers.status = adminUsers.status.toString()
        setFieldsValue({ ...adminUsers })
      })
    }
    // eslint-disable-next-line
  },[])

  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue)
    setFieldsValue({ permissions: checkedKeysValue })
  }

  const handleSubmit = () => {
    setLoading(true)
    const submitForm: any = { ...getFieldsValue() }
    if (typeof submitForm.status === 'string') {
      submitForm.status = parseInt(submitForm.status, 0)
    }
    if (id) {
      AdminUserApi.updateAdminUser(id, submitForm).then((res) => {
        setLoading(false)
        message.success(res.message)
      })
    } else {
      AdminUserApi.addAdminUser(submitForm).then((res) => {
        setLoading(false)
        message.success(res.message)
        const returnUrl = '/adminuser/list'
        closeTabAction(history, returnUrl)
      })
    }
  }

  const nameValidator = (rule, value) => {
    if (value.length < 4) {
      return Promise.reject(new Error('用户名最少4个字符'))
    }
    if (!/^[a-zA-Z0-9]{4,}$/.test(value)) {
      return Promise.reject(new Error('用户名只能是数字字母下划线组合'))
    }
    return Promise.resolve()
  }

  const repasswordValidator = (rule, value) => {
    const password = form.getFieldValue('password')
    if (password && password !== value) {
      return Promise.reject(new Error('两次密码输入不一致'))
    }
    return Promise.resolve()
  }

  return (
    <Spin spinning={loading}>
      <Form {...formItemLayout} form={form} onFinish={handleSubmit}>
        <Form.Item
          label="用户名"
          name="name"
          rules={[
            {
              required: true,
              validator: nameValidator
            }
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        {!id && (
          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码'
              },
              {
                min: 6
              }
            ]}
          >
            <Input placeholder="请输入密码" />
          </Form.Item>
        )}
        {!id && (
          <Form.Item
            label="确认密码"
            name="repassword"
            rules={[
              {
                required: true,
                validator: repasswordValidator
              }
            ]}
          >
            <Input placeholder="请输入确认密码" />
          </Form.Item>
        )}
        <Form.Item
          label="状态"
          name="status"
          rules={[
            {
              required: true,
              message: '请选择状态'
            }
          ]}
        >
          <MySelect
            data={[{ key: '0', name: '冻结' }, { key: '1', name: '正常' }]}
            placeholder="请选择状态"
          />
        </Form.Item>
        <Form.Item label="权限" name="permissions">
          <Tree
            checkable
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
          />
        </Form.Item>
        <Form.Item wrapperCol={wrapperCol}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default FormView
