import React, { FC } from 'react'
import { Col, Row } from 'antd'

const Home: FC = () => {
  return (
    <div style={{ height: '100vh', textAlign: 'center' }}>
      <Row>
        <Col span={12} flex={1}>
          <a
            href="https://github.com/bigfool-cn/react-antd-admin"
            target="_blank"
            rel="noopener noreferrer"
          >
            前端项目仓库
          </a>
        </Col>
        <Col span={12}>
          <a
            href="https://github.com/bigfool-cn/go-antd-admin-api"
            target="_blank"
            rel="noopener noreferrer"
          >
            服务端项目仓库
          </a>
        </Col>
      </Row>
    </div>
  )
}

export default Home
