'use client';

import NavLink from '@/app/nav-link';
import { ROUTE_CONFIG } from '@/configs/route';
import { Button, Form, Input, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

type TSignUpFieldType = {
  name: string;
  password: string;
  confirmPass: string;
  email: string;
  avatar: string;
};

const Register = () => {
  const onFinish = (values: TSignUpFieldType) => {
    console.log('Success:', values);
  };

  return (
    <div className='login-regiter-layout'>
      <Title style={{ textAlign: 'center' }}>Sign up</Title>

      <Form
        name="signup-form"
        initialValues={{ avatar: '' }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<TSignUpFieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<TSignUpFieldType>
          label="Password"
          name="password"
          hasFeedback
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<TSignUpFieldType>
          label="Confirm password"
          name="confirmPass"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  getFieldValue('password')?.trim() === value?.trim()
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The new password that you entered do not match!')
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<TSignUpFieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<TSignUpFieldType> label="Avatar (Image URL)" name="avatar">
          <Input />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <NavLink href={ROUTE_CONFIG.LOGIN}>Have an account? Go to Login</NavLink>
    </div>
  );
};

export default Register;