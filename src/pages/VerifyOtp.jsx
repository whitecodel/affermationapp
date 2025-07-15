import React, { useState } from 'react';
import { Form, Button, message } from 'antd';
import "./VerifyOtp.scss";
import { assets } from '../assets/assets';
import OtpInputBox from './OtpInputBox';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiKey = import.meta.env.VITE_FREESOUND_API_KEY;
const apiBaseUrl = import.meta.env.VITE_FREESOUND_BASE_URL;

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgetData } = useSelector((state) => state.auth);
  const navigate = useNavigate();

 
  const handleOtpSubmit = (otpValue) => {
    setOtp(otpValue);
  };

  const handleVerifyClick = async () => {
    if (!otp) {
      message.error("Please enter OTP");
      return;
    }

    setLoading(true);

    try {
      const headers = {
        Authorization: `Bearer ${forgetData}`, // Make sure forgetData is token
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      };

      const data = {
        otp_type: "password_forgot",
        device_token: "abcd1234efgh5678987",
        device_id: "ABC12345",
        device_type: "mobile",
        os: "android"
      }

      const response = await axios.post(
        `${apiBaseUrl}auth/otp/verify/`, // ✅ use VITE_FREESOUND_BASE_URL
        { otp, ...data },
        { headers }
      );

      if (response?.status === 200) {
        localStorage.setItem("verifyToken", response?.data?.result?.token);
        toast.success("OTP Verified Successfully");
        navigate('/reset-password');
      } else {
        toast.error(response?.data?.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "API request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="container">
        <div className="brand">
          <img src={assets?.logo} className='logo-image' height="50px" width="198px" />
        </div>
        <h2>Verify OTP</h2>

        <Form layout="vertical" autoComplete="off" className="forgot-form">
          <OtpInputBox onOtpSubmit={handleOtpSubmit} />

          <Form.Item>
            
            <Button
              className='same-btn '
              htmlType="submit"
              size="large"
              onClick={handleVerifyClick}
              loading={loading}
              block
            >
              Verify OTP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOtp;
