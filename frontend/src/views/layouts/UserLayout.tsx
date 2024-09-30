'use client';

import React from 'react';
import { Layout, Menu, theme, Typography } from 'antd';
import {
  HeartTwoTone,
  PieChartOutlined,
  SlidersOutlined,
} from '@ant-design/icons';
import NavLink from '@/app/nav-link';
import { HeaderComponent } from '@/components/header';
import { ROUTE_CONFIG } from '@/configs/route';
import { usePathname } from 'next/navigation';
import { getPathName } from '@/utils/paramsUrl';

const { Sider, Content, Footer } = Layout;
const { Link } = Typography;

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const pathname = usePathname();
  const selectedKeys = [`/${getPathName(pathname)}`];

  return (
    <Layout>
      <Sider trigger={null}>
        <Menu
          theme="dark"
          mode="inline"
          style={{ marginTop: '3rem' }}
          selectedKeys={selectedKeys}
          items={[
            {
              key: ROUTE_CONFIG.DASHBOARD,
              icon: <PieChartOutlined />,
              label: <NavLink href={ROUTE_CONFIG.DASHBOARD}>Dashboard</NavLink>,
            },
            {
              key: ROUTE_CONFIG.TOPIC,
              icon: <SlidersOutlined />,
              label: <NavLink href={ROUTE_CONFIG.TOPIC}>Review</NavLink>,
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
  );
};

export default UserLayout;
