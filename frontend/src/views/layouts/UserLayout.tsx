'use client';

import React from 'react';
import { Layout, theme } from 'antd';
import { HeaderComponent } from '@/components/header';
import SiderMenu from '@/components/SiderMenu';

const { Sider, Content } = Layout;

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{height: '100vh'}}>
      <HeaderComponent />

      <Layout className="site-layout h-full">
        <Sider
          breakpoint="lg"
          trigger={null}
          collapsedWidth="0"
        >
          <SiderMenu />
        </Sider>
        <Content
          style={{
            margin: '24px 16px',
            padding: 15,
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
