"use client"
import React from 'react';
import NavLink from '@/app/nav-link';
import { ROUTE_CONFIG } from '@/configs/route';
import useLogin from '@/hooks/useLogin';
import { TLoginType } from '@/types/auth/auth';
import { Button, Checkbox, Divider, Form, Input,Typography } from 'antd';

const { Title } = Typography;

const Login = () => {

  const { handleLogin, loading } = useLogin();

  const onFinish = async (values: TLoginType) => {
    handleLogin(values);

  };

  const loginByGoogle = () => {
    console.log('Login by Google');
  };

  return (
    <div className='login-regiter-layout'>
      <Title style={{ textAlign: 'center' }}>Login</Title>

      <Form
        name="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<TLoginType>
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<TLoginType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<TLoginType> name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <NavLink href={ROUTE_CONFIG.REGISTER}>
        Dont have an account? Go to Sign up
      </NavLink>

      <Divider>Or</Divider>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Button type="primary" onClick={loginByGoogle}>
          Đăng nhập bằng Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
