import React from 'react';
import { Metadata } from 'next';
import Register from '@/views/pages/register';

export const metadata: Metadata = {
  title: 'Register',
}

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;
