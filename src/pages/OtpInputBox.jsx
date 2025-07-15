import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import "./otpInputBox.scss";

const OtpInputBox = ({ onOtpSubmit }) => {
  const [otp, setOtp] = useState("");

  useEffect(() => {
    onOtpSubmit(otp);
  }, [otp, onOtpSubmit]);

  return (
    <div className="otp-container">
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
      />
    </div>
  );
};

export default OtpInputBox;
