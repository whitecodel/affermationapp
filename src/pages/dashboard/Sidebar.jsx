import React, { useState } from 'react';
import './Sidebar.scss';
import {
  AppstoreOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';
import { Modal, Button } from 'antd';
import LogoutModel from '../../components/model/LOgoutModel';

const Sidebar = () => {

  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    


  const showLogoutConfirm = () => {
    setIsImageModalVisible(true);
  };
  

  return (
    <div className="sidebar">
      <img src={assets?.logo} className="logo-image" alt="logo" height="50px" width="198px" />

      <div className="menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <AppstoreOutlined className="icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <UserOutlined className="icon" />
          <span>Profile</span>
        </NavLink>

        <div className="menu-item logout" onClick={showLogoutConfirm}>
            <LogoutOutlined className="icon" />
            <span>Logout</span>
</div>

  <LogoutModel isImageModalVisible={isImageModalVisible} setIsImageModalVisible ={setIsImageModalVisible}  />
{/* 
<Modal
  open={isImageModalVisible}
  onCancel={() => setIsImageModalVisible(false)}
  footer={null}
  closable={false}
  centered
  className="logout-modal"
>
  <div className="logout-modal-content">
    <h2 className="logout-title">Logout</h2>
    <p className="logout-message">Are you sure you want to logout?</p>

    <div className="logout-actions">
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
      >
        Yes, Logout
      </button>

      <button
        className="cancel-btn"
        onClick={() => setIsImageModalVisible(false)}
      >
        Cancel
      </button>
    </div>
  </div>
</Modal> */}


      </div>
    </div>
  );
};

export default Sidebar;


// import React from 'react';
// import './Sidebar.scss';
// import {
//   AppstoreOutlined,
//   UserOutlined,
//   LogoutOutlined,
// } from '@ant-design/icons';
// import { assets } from '../../assets/assets';
// import { NavLink } from 'react-router-dom';
// import { Modal, ConfigProvider } from 'antd';
// import { useModal } from 'antd/es/modal/useModal';

// const Sidebar = () => {
//   const [modal, contextHolder] = Modal.useModal();

//   const showLogoutConfirm = () => {
//     modal.confirm({
//       title: 'Are you sure you want to logout?',
//       content: 'You will need to log in again to access your dashboard.',
//       okText: 'Yes, Logout',
//       okType: 'danger',
//       cancelText: 'Cancel',
//       onOk() {
//         localStorage.clear();
//         window.location.href = '/';
//       },
//     });
//   };

//   return (
//     <div className="sidebar">
//       {/* Required for modal to work */}
//       {contextHolder}

//       <img src={assets?.logo} className="logo-image" alt="logo" height="50px" width="198px" />

//       <div className="menu">
//         <NavLink
//           to="/dashboard"
//           className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
//         >
//           <AppstoreOutlined className="icon" />
//           <span>Dashboard</span>
//         </NavLink>

//         <NavLink
//           to="/profile"
//           className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
//         >
//           <UserOutlined className="icon" />
//           <span>Profile</span>
//         </NavLink>

//         <div className="menu-item logout" onClick={showLogoutConfirm}>
//           <LogoutOutlined className="icon" />
//           <span>Logout</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

