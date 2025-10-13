import { useEffect, useState } from "react";
import LoginForm from "../components/Login/Login_Form";
import RegisterForm from "../components/Register/Register_Form";
import ForgetPassForm from "../components/Login/ForgetPass_Form";
import "../Css/AuthPage.css";
import { checkBackendStatus } from "../API/config";

function AuthPage() {
  const [form_type, setForm_type] = useState("login");


  useEffect(() => {
    (async () => {
      if (!await checkBackendStatus()){
        alert("Backend Is Not Running")
        window.location.href = "/"
      }
    })();

const params = new URLSearchParams(window.location.search);
  const type = params.get("type");

  if (type === "register") {
    setForm_type("register");

  } else if (type === "forgetpass"){
      setForm_type("forgetpass")
  } else {
    setForm_type("login");
      if (type !== "login") {
        params.set("type", "login");
        window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
        }
      }
  }, [])

  return (
    <div className="auth-container">
      {form_type === "login" && (
        <LoginForm
          toggleForm={() => {
            setForm_type("register");
            const params = new URLSearchParams(window.location.search);
            params.set("type", "register");
            window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
          }}
          toggleForgetPassForm={() => {
            setForm_type("forgetpass");
            const params = new URLSearchParams(window.location.search);
            params.set("type", "forgetpass");
            window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
          }}
        />)}
      {form_type === "forgetpass" && (
        <ForgetPassForm
          toggleForm={() => {
            setForm_type("login");
            const params = new URLSearchParams(window.location.search);
            params.set("type", "register");
            window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
          }}
        />)}
      {form_type === "register" && (
        <RegisterForm
          toggleForm={() => {
            setForm_type("login");
            const params = new URLSearchParams(window.location.search);
            params.set("type", "login");
            window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
          }}
        />
      )}
    </div>
  );
};

export default AuthPage;
