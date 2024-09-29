'use client';

import useLogout from '@/hooks/useLogout';
import { Button } from 'antd';
import React from 'react';


const DashboardPage = () => {
  const { handleLogout, loading } = useLogout(); 

  return <div>
    <Button loading={loading} onClick={() => handleLogout()}>Logout</Button>
  </div>;
};

export default DashboardPage;
