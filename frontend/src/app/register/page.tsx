import React from 'react';
import Register from '../views/pages/register';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
}

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;
