import NavLink from '@/app/nav-link';
import { ROUTE_CONFIG } from '@/configs/route';
import { getPathName } from '@/utils/paramsUrl';
import { Menu } from 'antd';
import { usePathname } from 'next/navigation';
import React from 'react';
import { PieChartOutlined, SlidersOutlined } from '@ant-design/icons';

const SiderMenu = () => {
  const pathname = usePathname();
  const selectedKeys = [`/${getPathName(pathname)}`];

  return (
    <>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        style={{ height: '100%' }}
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
    </>
  );
};

export default SiderMenu;
