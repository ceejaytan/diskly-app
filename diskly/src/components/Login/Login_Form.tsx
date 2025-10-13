import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { submitLogin } from "./Login_script";

import hiddenIcon from "../../assets/password-hidden.svg";
import shownIcon from "../../assets/password-shown.svg";

interface LoginFormProps {
  toggleForm: () => void;
  toggleForgetPassForm: () => void;
}

export default function LoginForm({ toggleForm, toggleForgetPassForm }: LoginFormProps){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loginMessage, setLoginMessage] = useState("");

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const redirect = searchParams.get("redirect");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if ( await submitLogin(username, password)){
      navigate(redirect || "/")
    }else{
      setLoginMessage("Wrong Username Or Password")
    }
    setLoading(false);

  }

  return (
    <form onSubmit={handleSubmit}>

      {/* 🔄 Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl z-50">
          <div className="w-14 h-14 border-4 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-center">
        <img
          src="/images/disklogo.png"
          alt="Diskly Logo"
          className="w-20 h-20 object-contain cursor-pointer"
          onClick={() => {window.location.href = "/"}}
        />
      </div>
      <h2>Sign In</h2>


      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setLoginMessage(""); }}
          required
          className="
          border-cyan-400 border-2 rounded-[10px]
          bg-[#D6DCDE]
          text-black
          "
        />

      </div>

      <div className="form-group">
        <label>Password</label>
          <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {setPassword(e.target.value); setLoginMessage("")}}
          required
          className="
          border-cyan-400 border-2 rounded-[10px]
          bg-[#D6DCDE]
          text-black
          "
        />

          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <img
              src={showPassword ? shownIcon : hiddenIcon}
              alt={showPassword ? "Hide password" : "Show password"}
            />
          </button>
      </div>

          </div>
      {loginMessage &&(
        <small className="text-red-500">{ loginMessage }</small>
      )}

      <div className="button-stack">
        <button type="submit" className="btn btn-primary">
          Login
        </button>

        <div className="button-row">
          <button type="button" className="btn btn-back" onClick={() => navigate(-1)}>
            Go Back
          </button>
          </div>
        </div>

        <button type="button" className="btn btn-toggle justify-center w-full" onClick={toggleForgetPassForm}>
        Forget password or username?
        </button>
      <hr/>
      <p className="toggle-text">
        Don’t have an account?
        <button type="button" className="btn btn-toggle" onClick={toggleForm}>
          Register
        </button>
      </p>
    </form>
  );
};

