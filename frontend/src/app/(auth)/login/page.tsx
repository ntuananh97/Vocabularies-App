import React from 'react';
import { Metadata } from 'next';
import Login from '@/views/pages/login';

export const metadata: Metadata = {
  title: 'Login',
}

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
