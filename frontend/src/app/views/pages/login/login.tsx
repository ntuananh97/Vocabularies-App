"use client"

import NavLink from '@/app/nav-link';
import { ROUTE_CONFIG } from '@/configs/route';
import { Button, Checkbox, Divider, Form, Input, Typography } from 'antd';
import React from 'react';


const { Title } = Typography;

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};


const Login = () => {

    const onFinish = (values: FieldType) => {
        console.log('Success:', values);
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
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">
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
