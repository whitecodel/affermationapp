import React from 'react'
import { Modal, Button, Form, Input } from "antd";
import InputField from '../InputField';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileAction } from '../../redux/reducer/AuthSlice';
import { toast } from 'react-toastify';

const EditProfileModel = ({setLoadProfileApi, isEditOpen, setIsEditOpen }) => {

  const dispatch = useDispatch()

    const handleEditSubmit = async (values) => {
      const data = await dispatch(updateProfileAction(values));
      setLoadProfileApi(prev => !prev)
      setIsEditOpen(false);
    };

      const { viewProfile } = useSelector(
        (prev) => prev?.auth
      );

  return (
    <Modal
    title={<div className="modal-title-center">Edit Profile</div>}
    open={isEditOpen}
    onCancel={() => setIsEditOpen(false)}
    closable={false} // 🚫 removes the × icon
    centered // ✅ vertically centers the modal (optional)
    footer={null}
  >
    <Form layout="vertical" onFinish={handleEditSubmit}>
      <Form.Item name="fullname" label="Full Name" initialValue={viewProfile?.fullname}>
        <InputField />
      </Form.Item>
      <Form.Item>
      <div className="button-group">
  <Button onClick={() => setIsEditOpen(false)} className="same-btn-one cancel-btn" htmlType="button">
    Cancel
  </Button>
  <Button type="primary" className="same-btn same-btn-one" htmlType="submit">
    Save Changes
  </Button>
</div>

      </Form.Item>
    </Form>
  </Modal>

  )
}

export default EditProfileModel