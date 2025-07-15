import React from 'react'
import { Modal, Button, Form, Input } from "antd";
import InputField from '../InputField';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiKey = import.meta.env.VITE_FREESOUND_API_KEY;
const apiBaseUrl = import.meta.env.VITE_FREESOUND_BASE_URL;

const ChangePasswordModel = ({setIsPasswordOpen, isPasswordOpen}) => {
   
   

      const [form] = Form.useForm();
      // const { forgetData } = useSelector((state) => state.auth);
      const forgetData =  localStorage.getItem("ACCESS_TOKEN")
      const navigate = useNavigate()
    
     
      const handlePasswordSubmit = async (values) => {
    
        // const new_password = {old-password: values?.newPassword
    
          const data = {
            old_password: values?.old_password,
            new_password: values?.new_password,
            confirm_password: values?.confirm_password,
          }
    
    
    
        const headers = {
          Authorization: `Bearer ${forgetData}`, // Ensure forgetData contains a valid token
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        };
    
        try {
          const response = await axios.patch(
            `${apiBaseUrl}/auth/password/change/`, // Ensure the correct base URL
            { ...data },  
            { headers } // Headers
          );
      
        
      
          if (response?.status === 201 || 200) {
            toast.success('Password Change Successfully')
            setIsPasswordOpen(false);
            form.resetFields();
            onClose()
          } else {
           toast.error(response?.data?.message || "reset password verification failed");
          }
        } catch (error) {
         
          console.error("Error verifying OTP:", error);
          
        }
      };
    
    

  return (
    <Modal
    title={<div className="modal-title-center">Change Password</div>}
    open={isPasswordOpen}
    onCancel={() => setIsPasswordOpen(false)}
    closable={false} // 🚫 removes the × icon
    centered // ✅ vertically centers the modal (optional)
    footer={null}
  >
    <p className='forget-para'>Please enter your current password and new password.</p>
    <Form layout="vertical" onFinish={handlePasswordSubmit}>
      <Form.Item
        name="old_password"
        label="Current Password"
        rules={[{ required: true }]}
      >
       <InputField type="password" placeholder="Enter Current Password" showToggle="true" />
      </Form.Item>
     
      <Form.Item
        name="new_password"
        label="New Password"
        rules={[{ required: true }]}
      >
       <InputField type="password" placeholder="Enter New Password" showToggle="true" />
      </Form.Item>
     
    <Form.Item
        name="confirm_password"
        label="Confirm Password"
        dependencies={['newPassword']}
        rules={[
          { required: true },
          // ({ getFieldValue }) => ({
          //   validator(_, value) {
          //     if (!value || getFieldValue('newPassword') === value) {
          //       return Promise.resolve();
          //     }
          //     return Promise.reject('Passwords do not match!');
          //   }
          // }),
        ]}
      >
        <InputField type="password" placeholder="Enter confirm Password" showToggle="true" />
      </Form.Item>
      <Form.Item>
      <div className="button-group">
  <Button onClick={() => setIsPasswordOpen(false)} className="same-btn-one cancel-btn" htmlType="button">
    Cancel
  </Button>
  <Button type="primary" className="same-btn same-btn-one" htmlType="submit">
    Change
  </Button>
</div>
      </Form.Item>
    </Form>
  </Modal>
  )
}

export default ChangePasswordModel