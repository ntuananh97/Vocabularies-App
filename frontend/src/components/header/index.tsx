'use client';
import { UserOutlined } from '@ant-design/icons';
import { Dropdown, Layout, MenuProps, theme } from 'antd';

const { Header } = Layout;

import { Avatar } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import useLogout from '@/hooks/useLogout';

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

export const HeaderComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { user } =  useAuth();
  const { handleLogout } =  useLogout();


  const handleClickMenus: MenuProps['onClick'] = (e) => {
    console.log("HeaderComponent ~ e:", e)
    if (e.key === MENU_KEYS.LOGOUT) {
      handleLogout()
    }
  }

  return (
    <>
      <Header
        style={{
          display: 'flex',
          background: colorBgContainer,
          alignItems: 'center',
          justifyContent: 'end',
        }}
      >
        <Dropdown menu={{ items, onClick: handleClickMenus }} >
          <div className='flex items-center cursor-pointer'>
            <Avatar src={user?.avatar} icon={<UserOutlined />} />
            <span style={{ padding: 5 }}>{user?.name}</span>
          </div>
        </Dropdown>
       
      </Header>
    </>
  );
};
