import React, { useState } from "react";
import LoginForm from "../components/Login_Form";
import RegisterForm from "../components/Register_Form";
import "../Css/AuthPage.css";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="auth-container">
      {isLogin ? (
        <LoginForm toggleForm={() => setIsLogin(false)} />
      ) : (
        <RegisterForm toggleForm={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;
