// pages/Login.jsx
import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './Login.scss';
import {  Link, useNavigate } from "react-router-dom";
import { assets } from '../assets/assets';
import InputField from '../components/InputField';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction } from '../redux/reducer/AuthSlice';
import { toast } from 'react-toastify';



const { Title, Text } = Typography;

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [form] = Form.useForm();
   
  
    const { AuthLoading, AuthData, AuthError } = useSelector(
      (prev) => prev?.auth
    );
  
   
  
    const onFinish = async (values) => {
      const data = {
        device_token: "abcd1234efgh5678782",
        device_id: "ABC123",
        device_type: "mobile",
        os: "android"
      };
      const newValues = { ...values, ...data };
      const loginUser = await dispatch(AuthAction(newValues))
      if (loginUser?.type === "data/auth/fulfilled") {
        toast.success("User logged in successfully");
        localStorage.setItem("ACCESS_TOKEN", loginUser?.payload?.access_token)
        navigate("/dashboard")  
      }
      else{
        toast.error(loginUser?.payload?.message)
      }
    };

  return (
    <div className="login-page">
      <div className="login-form">
        <img src={assets?.logo} className='logo-image' height="50px" width="198px" />
       
        <Title level={3} className="login-heading">Hey, Welcome</Title>

        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email address' }
            ]}
          >
            <InputField  placeholder="Enter email address" />
           
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <InputField type="password"   placeholder="Enter password" showToggle="true" />
            {/* <Input.Password
              placeholder="Enter password"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            /> */}
          </Form.Item>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <Form.Item>
            <Button type="primary" loading={AuthLoading}  htmlType="submit" className="login-btn same-btn" block>
              Log In
            </Button>
          </Form.Item>

          <Text className="register-link">
            Don’t have an account? <Link className='link-clr' to="/register">Register</Link>
          </Text>
        </Form>
      </div>
    </div>
  );
};

export default Login;
