import React, { useState, useRef, useEffect } from 'react';
import './Topbar.scss';
import { AppstoreOutlined, DownOutlined, EyeOutlined, LogoutOutlined } from '@ant-design/icons';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import LogoutModel from '../../components/model/LOgoutModel';
import { useDispatch, useSelector } from 'react-redux';
import { viewAdminProfile } from '../../redux/reducer/AuthSlice';

const Topbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch()
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const { viewProfile } = useSelector(
    (prev) => prev?.auth
  );

  useEffect(()=>{
    dispatch(viewAdminProfile())
  },[])

    


  const showLogoutConfirm = () => {
    setIsImageModalVisible(true);
  };
  

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="topbar">
      <h2>Hello {viewProfile?.fullname}!</h2>

      <div className="user-info" ref={dropdownRef}>
        <div className="avatar">
          <img src={assets?.profile} alt="User" className="profile-image" />
        </div>
        <div className="details" onClick={toggleDropdown}>
          <div className="name">{viewProfile?.fullname}</div>
          <div className="email">{viewProfile?.email}</div>
        </div>
        <DownOutlined className="dropdown-icon" onClick={toggleDropdown} />

        {showDropdown && (
          <div className="user-dropdown">
            <div className="dropdown-item">
            <AppstoreOutlined className="icon" />
            <Link className="link-deisgn" to="/dashboard">
                Dashboard
              </Link>
        </ div>
            <div className="dropdown-item">
              <EyeOutlined />{' '}
              <Link className="link-deisgn" to="/profile">
                View Profile
              </Link>
            </div>
            <div className="dropdown-item logout" onClick={showLogoutConfirm}>
              <LogoutOutlined /> <span>Logout</span>
            </div>
          </div>
        )}
      </div>
      <LogoutModel isImageModalVisible={isImageModalVisible} setIsImageModalVisible ={setIsImageModalVisible}  />
    </div>
  );
};

export default Topbar;




