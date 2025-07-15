// pages/Register.jsx
import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './Register.scss';
import {  Link, useNavigate } from "react-router-dom";
import { assets } from '../assets/assets';
import InputField from '../components/InputField';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/reducer/AuthSlice';
import { toast } from 'react-toastify';


const { Title, Text } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const dispatch= useDispatch()
  const navigate = useNavigate()

  const handleRegister = async (values) => {

    const { confirmPassword, ...formData } = values;

    const data = {
      ...formData,
      device_token: "abcd1234efgh5678782",
      device_id: "ABC123",
      device_type: "mobile",
      os: "android"
    };
    
   
    const loginUser = await dispatch(registerUser(data));
    if (loginUser?.type === "auth/register/fulfilled") {
      toast.success("User Registeration  successfully");
      
      // navigate(urlConstant?.dashboardConstant);
      navigate("/");
    }
    else{
      toast.error(loginUser?.payload?.message)
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
      <img src={assets?.logo} className='logo-image' height="50px" width="198px" />
        <Title level={3} className="register-heading">Register To Get Started</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          autoComplete="off"
        >
          <Form.Item
            label="Full Name"
            name="fullname"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <InputField  placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email address' },
            ]}
          >
            <InputField placeholder="Enter email address" />
          </Form.Item>
          <Form.Item
  label="Password"
  name="password"
  rules={[
    { required: true, message: 'Please enter your password' },
    { min: 6, message: 'Password must be at least 6 characters' },
    {
      pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      message:
        'Password must contain uppercase, lowercase, number, and special character',
    },
  ]}
  hasFeedback
>
  <InputField type="password" placeholder="Enter password" showToggle="true" />
</Form.Item>

<Form.Item
  label="Confirm Password"
  name="confirmPassword"
  dependencies={['password']}
  hasFeedback
  rules={[
    { required: true, message: 'Please confirm your password' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Passwords do not match'));
      },
    }),
  ]}
>
  <InputField
    type="password"
    placeholder="Confirm password"
    showToggle="true"
  />
</Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-btn" block>
              Register
            </Button>
          </Form.Item>

          <Text className="login-link">
            Already have an account? <Link className='link-clr' to="/">Login</Link>
          </Text>
        </Form>
      </div>
    </div>
  );
};

export default Register;
