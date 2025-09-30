import React, { useEffect, useState } from "react";
import LoginForm from "../components/Login/Login_Form";
import RegisterForm from "../components/Register/Register_Form";
import "../Css/AuthPage.css";
import { checkBackendStatus } from "../API/config";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);


  useEffect(() => {
    (async () => {
      if (!await checkBackendStatus()){
        alert("Backend Is Not Running")
        window.location.href = "/"
      }
    })();
  }, [])

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
