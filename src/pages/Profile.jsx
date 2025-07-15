import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import "./ProfileSettings.scss";
import { assets } from "../assets/assets";
import EditProfileModel from "../components/model/EditProfileModel";
import ChangePasswordModel from "../components/model/ChangePasswordModel";
import { EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { viewAdminProfile } from "../redux/reducer/AuthSlice";

const Profile = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [loadProfileApi, setLoadProfileApi] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch()

  const { viewProfile, viewProfileLoading, viewProfileError } = useSelector(
    (prev) => prev?.auth
  );

 

  useEffect(()=>{
    dispatch(viewAdminProfile())
  },[dispatch, loadProfileApi])

  const handleEditSubmit = (values) => {
    setIsEditOpen(false);
  };

  const handlePasswordSubmit = (values) => {
    setIsPasswordOpen(false);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <div>
      <h3 className="profile-set">Profile Settings</h3>
      <p className="profile-text">Update your personal information and preferences to keep your profile up-to-date.</p>
      </div>
        <div className="user-info">
          <div className="details">
            
          
          </div>
          <button className="edit-btn" onClick={() => setIsEditOpen(true)}>
          <EditOutlined style={{ fontSize: 20, marginRight: "10px" }} /> Edit Profile
          </button>
        </div>
      </div>

      <div className="settings">
      

        <div className="info-cards">
          <div className="info-item">
            <div className="icon">
                <img src={assets?.blod} />
            </div>
            <div>
              <div className="label">Full Name</div>
              <div className="value">{viewProfile?.fullname}</div>
            </div>
          </div>

          <div className="info-item">
            <div className="icon">
            <img src={assets?.letter} />
            </div>
            <div>
              <div className="label">Email Address</div>
              <div className="value">{viewProfile?.email}</div>
            </div>
          </div>
        </div>

        <button className="change-password" onClick={() => setIsPasswordOpen(true)}>
          Change Password  ↗
        </button>
      </div>

      <EditProfileModel setLoadProfileApi={setLoadProfileApi}  isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen}         />

  
      <ChangePasswordModel isPasswordOpen={isPasswordOpen}  setIsPasswordOpen={setIsPasswordOpen} />
    </div>
  );
};

export default Profile;
