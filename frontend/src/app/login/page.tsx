import React from 'react';
import Login from '../views/pages/login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
}

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
