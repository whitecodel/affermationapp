import React from 'react'
import { Modal, Button } from 'antd';

const LogoutModel = ({isImageModalVisible, setIsImageModalVisible}) => {
  return (
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
</Modal>
  )
}

export default LogoutModel