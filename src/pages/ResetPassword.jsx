// import React, { useState } from 'react';
// import { Form, Input, Button, message } from 'antd';
// import './ForgotPassword.scss';
// import InputField from '../components/InputField';
// import { assets } from '../assets/assets';
// import { useNavigate } from 'react-router-dom';

// const apiKey = import.meta.env.VITE_FREESOUND_API_KEY;
// const apiBaseUrl = import.meta.env.VITE_FREESOUND_BASE_URL;

// export default function ResetPassword() {
//   const [loading, setLoading] = useState(false);

//   const [form] = Form.useForm();
//   const forgetData =  localStorage.getItem("verifyToken")
//   const navigate = useNavigate()

//   const onFinish = async (values) => {

//     const new_password = values?.newPassword

//     const headers = {
//       Authorization: `Bearer ${forgetData}`, // Ensure forgetData contains a valid token
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//     };

//     try {
//       const response = await axios.patch(
//         `${apiBaseUrl}auth/password/reset`, // Ensure the correct base URL
//         { new_password },  // Request body
//         { headers } // Headers
//       );
  
    
  
//       if (response?.status === 201) {
       
//         navigate('/')
//         message.success("OTP Verified Successfully");
//       } else {
//         message.error(response?.data?.message || "reset password verification failed");
//       }
//     } catch (error) {
     
//       console.error("Error verifying OTP:", error);
      
//     }
  


   
//     message.success("Password reset successfully!");
//     // Call API for password reset if needed
//   };
//   return (
//     <div className="forgot-password-page">
//       <div className="container">
//         <div className="brand">
//         <img src={assets?.logo} className='logo-image' height="50px" width="198px" />
//         </div>
//         <h2>Reset Password?</h2>

//         <Form
//           layout="vertical"
//           onFinish={onFinish}
//           autoComplete="off"
//           className="forgot-form"
//         >
//           <Form.Item
//             label="New Password"
//             name="new-password"
//             rules={[
//               { required: true, message: 'Please enter your email' },
//               { type: 'email', message: 'Enter a valid email address' },
//             ]}
//           >
//             <InputField placeholder="Enter New Password"  />
//           </Form.Item>

//           <Form.Item
//             label="Confirm New Password"
//             name="new-password"
//             rules={[
//               { required: true, message: 'Please enter your email' },
//               { type: 'email', message: 'Enter a valid email address' },
//             ]}
//           >
//             <InputField placeholder="Confirm Password"  />
//           </Form.Item>
//           <Form.Item>
            
//             <Button
//             //   type="primary"
//             className='same-btn'
//               htmlType="submit"
//               size="large"
//               loading={loading}
//               block
//             >
//               Send Password Reset Link
//             </Button>
          
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Form, Button, message } from 'antd';
import './ForgotPassword.scss';
import InputField from '../components/InputField';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiKey = import.meta.env.VITE_FREESOUND_API_KEY;
const apiBaseUrl = import.meta.env.VITE_FREESOUND_BASE_URL;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const forgetData = localStorage.getItem("verifyToken");
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { newPassword } = values;

    const headers = {
      Authorization: `Bearer ${forgetData}`,
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    try {
      setLoading(true);
      const response = await axios.patch(
        `${apiBaseUrl}auth/password/reset/`,
        { new_password: newPassword,
          confirm_password: newPassword,
          device_id: "ABC12345"
         },
        { headers }
      );

      if (response?.status === 200) {
       toast.success("Password reset successfully!");
        navigate('/');
      } else {
        message.error(response?.data?.message || "Password reset failed.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
   toast.error(error?.response?.data?.message || "Something went wrong.");
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
        <h2>Reset Password</h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="forgot-form"
        >
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
            hasFeedback
          >
            <InputField placeholder="Enter New Password" type="password" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <InputField placeholder="Confirm Password" type="password" />
          </Form.Item>

          <Form.Item>
            <Button
              className='same-btn'
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

