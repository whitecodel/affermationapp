import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import './ForgotPassword.scss';
import InputField from '../components/InputField';
import { assets } from '../assets/assets';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordAction } from '../redux/reducer/AuthSlice';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { forgetLoading, forgetError, data, error  } = useSelector((state) => state.auth);


  const onFinish = async (values) => {
    const data = await dispatch(forgotPasswordAction({ email: values.email }))
    if(data?.type === "auth/forgotPassword/fulfilled"){
      toast.success("send")
      navigate('/verify-otp')
    }else{
      toast.error(data?.payload?.message)
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="container">
        <div className="brand">
        <img src={assets?.logo} className='logo-image' height="50px" width="198px" />
        </div>
        <h2>Forgot Password?</h2>

        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="forgot-form"
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email address' },
            ]}
          >
            <InputField placeholder="Enter email address"  />
          </Form.Item>

          <Form.Item>
            <Button
            //   type="primary"
            className='same-btn'
              htmlType="submit"
              size="large"
              loading={forgetLoading}
              block
            >
              Send Password Reset Link
            </Button>
          
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
