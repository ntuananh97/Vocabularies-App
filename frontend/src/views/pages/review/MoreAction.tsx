import { Button, Dropdown, MenuProps, Tooltip } from 'antd';
import React from 'react';
import { MoreOutlined } from '@ant-design/icons';

const ACTION_KEYS = {
  DELETE: '4',
};

const items: MenuProps['items'] = [
  {
    key: ACTION_KEYS.DELETE,
    label: 'Delete',
  },
];

const MoreAction = () => {

  const handleClickMenus: MenuProps['onClick'] = (e) => {
    console.log("HeaderComponent ~ e:", e)
  }

  return (
    <>
      <Dropdown.Button menu={{ items, onClick: handleClickMenus }}>
        <Tooltip title="More actions">
          <MoreOutlined />
        </Tooltip>
      </Dropdown.Button>
    </>
  );
};

export default MoreAction;
