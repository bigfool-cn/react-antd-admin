import React, { useEffect, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input, Button } from 'antd'
import ReactCanvasNest from 'react-canvas-nest'
import './login.less'
import Logo from '@/assets/img/logo.png'
import { setUserInfo } from '@/assets/js/publicFunc'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import common from '@/api'

interface Props extends ReduxProps {}

const LoginForm: FC<Props> = ({
  storeData: { theme, userInfo = {} },
  setStoreData
}) => {
  const history = useHistory()
  useEffect(() => {
    const { token } = userInfo
    if (token) {
      history.push('/')
      return
    }
    // 重置 tab栏为首页
    setStoreData('SET_CURTAB', ['/'])
  }, [history, setStoreData, userInfo])

  // 触发登录方法
  const onFinish = (values: CommonObjectType<string>): void => {
    const { username } = values
    common.login(values).then((res: any) => {
      // 登录后返回的数据，包括权限
      const resData = {
        userName: username,
        token: res.data.token,
        permission: res.data.permissions
      }
      setUserInfo(resData, setStoreData)
      history.push('/')
    })
  }

  const FormView = (
    <Form className="login-form" name="login-form" onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" prefix={<UserOutlined />} size="large" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password
          placeholder="密码"
          prefix={<LockOutlined />}
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button
          className="login-form-button"
          htmlType="submit"
          size="large"
          type="primary"
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  )

  const floatColor = theme === 'default' ? '24,144,255' : '110,65,255'
  return (
    <div className="login-layout" id="login-layout">
      <ReactCanvasNest
        config={{
          pointColor: floatColor,
          lineColor: floatColor,
          pointOpacity: 0.6
        }}
        style={{ zIndex: 1 }}
      />
      <div className="logo-box">
        <img alt="" className="logo" src={Logo} />
        <span className="logo-name">React Antd Admin</span>
      </div>
      {FormView}
    </div>
  )
}

export default connect(
  (state) => state,
  actions
)(LoginForm)
