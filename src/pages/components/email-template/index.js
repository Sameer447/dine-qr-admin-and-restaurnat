import React from "react";

const ResetPasswordEmail = ({ resetLink, userName }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      <h2>Password Reset Request</h2>
      <p>Hi there, {userName}</p>
      <p>
        We received a request to reset your password. Click the link below to
        reset it:
      </p>
      <a
        href={resetLink}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          margin: "10px 0",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: "#007bff",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        Reset Password
      </a>
      <p>
        If you did not request a password reset, please ignore this email or
        contact support if you have questions.
      </p>
      <p>Thanks,</p>
      <p>Your Company Team</p>
    </div>
  );
};

export default ResetPasswordEmail;
