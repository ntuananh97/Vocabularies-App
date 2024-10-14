'use client';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { Dropdown, Grid, Layout, MenuProps, theme } from 'antd';

const { Header } = Layout;

import { Avatar } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import useLogout from '@/hooks/useLogout';
import SiderMenu from '../SiderMenu';
import { useState } from 'react';
import CustomAntdDrawer from '../CustomAntdDrawer';

const MENU_KEYS = {
  PROFILE: '2',
  LOGOUT: '3',
}

const items: MenuProps['items'] = [

  {
    key: MENU_KEYS.PROFILE,
    label: 'Profile',
  },
  {
    key: MENU_KEYS.LOGOUT,
    label: 'Logout',
  },


];

const { useBreakpoint } = Grid;

export const HeaderComponent = () => {

  const [open, setOpen] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { user } =  useAuth();
  const { handleLogout } =  useLogout();

  const {lg: lgBreakpoint} = useBreakpoint();

  const handleClickMenus: MenuProps['onClick'] = (e) => {
    console.log("HeaderComponent ~ e:", e)
    if (e.key === MENU_KEYS.LOGOUT) {
      handleLogout()
    }
  }

  const openSiderMenuInMobile = () => {
    setOpen(true);
  }

  return (
    <>
      <Header
        style={{
          display: 'flex',
          background: colorBgContainer,
          alignItems: 'center',
          justifyContent: lgBreakpoint ? 'end' : 'space-between',
        }}
      >
          {!lgBreakpoint ? <MenuOutlined onClick={openSiderMenuInMobile} /> : null}
          <Dropdown menu={{ items, onClick: handleClickMenus }} >
            <div className='flex items-center cursor-pointer'>
              <Avatar src={user?.avatar} icon={<UserOutlined />} />
              <span style={{ padding: 5 }}>{user?.name}</span>
            </div>
          </Dropdown>
      </Header>

      <CustomAntdDrawer
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        style={{padding: 0}}
        className='side-menu-drawer'
        width="50%"
      >
        <SiderMenu />
      </CustomAntdDrawer>
    </>
  );
};
