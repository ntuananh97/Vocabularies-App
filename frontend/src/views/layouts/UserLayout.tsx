'use client';

import React from 'react'
import { Layout, Menu, theme, Typography } from 'antd';
import {
    DeploymentUnitOutlined,
    HeartTwoTone,
    PieChartOutlined,
    SlidersOutlined,
    TeamOutlined,
    UnorderedListOutlined,
  } from '@ant-design/icons';
import NavLink from '@/app/nav-link';
import { HeaderComponent } from '@/components/header';

const { Sider, Content, Footer } = Layout;
const { Link } = Typography;

interface UserLayoutProps {
    children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({children}) => {
    const {
        token: { colorBgContainer },
      } = theme.useToken();
  return (
    <Layout>
    <Sider trigger={null}>
      <Menu
        theme="dark"
        mode="inline"
        style={{ marginTop: '3rem' }}
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <PieChartOutlined />,
            label: <NavLink href="/">Dashboard</NavLink>,
          },
          {
            key: '2',
            icon: <SlidersOutlined />,
            label: <NavLink href="/assets">Ativos</NavLink>,
          },
          {
            key: '3',
            icon: <TeamOutlined />,
            label: <NavLink href="/users">Usuários</NavLink>,
          },
          {
            key: '4',
            icon: <DeploymentUnitOutlined />,
            label: <NavLink href="/units">Unidades</NavLink>,
          },
          {
            key: '5',
            icon: <UnorderedListOutlined />,
            label: <NavLink href="/companies">Empresas</NavLink>,
          },
        ]}
      />
    </Sider>
    <Layout className="site-layout">
      <HeaderComponent />
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          height: '52rem',
          background: colorBgContainer,
          overflow: 'auto',
        }}
      >
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Made with {<HeartTwoTone twoToneColor="#993399" />} by{' '}
        <Link href="https://github.com/biantris" target="_blank">
          biantris
        </Link>
      </Footer>
    </Layout>
  </Layout>
  )
}

export default UserLayout