// components/InputField.jsx
import React from 'react';
import './InputField.scss';
import { assets } from '../assets/assets';


const InputField = ({ label, type = 'text', className="", placeholder, value, onChange, name, showToggle = false }) => {
  const [visible, setVisible] = React.useState(false);
  const inputType = showToggle ? (visible ? 'text' : 'password') : type;

  return (
    <div className="input-field">
      <label>{label}</label>
      <div className="input-wrapper">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          autoComplete="off"
          className={className}
        />
        {showToggle && (
          <span className="eye-icon" onClick={() => setVisible(!visible)}>
            {visible ? '👁️' : 
            <img src={assets?.eye} height="20px" width="20px" />
             }
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;
