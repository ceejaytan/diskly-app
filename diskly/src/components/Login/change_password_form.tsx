import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../API/config";

import hiddenIcon from "../../assets/password-hidden.svg";
import shownIcon from "../../assets/password-shown.svg";

interface ForgetPassFormProps {
  code: string;
  email: string;
  toggleForm: () => void;
}

export default function ChangePasswordForm({code, email, toggleForm}: ForgetPassFormProps) {
  const [newpassword, setNewPassword] = useState("");
  const [Confirmnewpassword, setConfirmNewPassword] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const [confirmpasswordMessage, setConfirmPasswordMessage] = useState("");
  const [confirmpasswordValid, setConfirmPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const [loading, setLoading] = useState(false);
  const [successMessage, seSuccessMessage] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    if (!newpassword) {
      setPasswordMessage("");
      setPasswordValid(false);
      return;
    }

    if (newpassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters");
      setPasswordValid(false);
    } else {
      setPasswordMessage("");
      setPasswordValid(true);
    }
  }, [newpassword]);

useEffect(() => {
  if (!Confirmnewpassword) {
    setConfirmPasswordMessage("");
    setConfirmPasswordValid(false);
    return;
  }

  if (Confirmnewpassword !== newpassword) {
    setConfirmPasswordMessage("Passwords do not match");
    setConfirmPasswordValid(false);
  } else {
    setConfirmPasswordMessage("");
    setConfirmPasswordValid(true);
  }
}, [Confirmnewpassword, newpassword]);

async function submitChangePass(e: any){
    e.preventDefault();
    setLoading(true);
    seSuccessMessage("");

    const formdata = new FormData();
    formdata.append("code", code);
    formdata.append("email", email);
    formdata.append("new_password", newpassword);

    const res = await fetch(`${API_URL}/accounts/change-password`, {
      method: "POST",
      credentials: "include",
      body: formdata
    });
    if (res.ok){
      setLoading(false);
      seSuccessMessage("Successfully changed password redirecting you back to login");
      setTimeout(() => {
        toggleForm();
        window.location.href = "/AuthPage?type=login"
      }, 3000)
    }else{
      setLoading(false);
      seSuccessMessage("Failed to change password");
      setTimeout(() => {
        seSuccessMessage("");
      }, 5000)
    }

  }


  return (
    <form onSubmit={(e) => {submitChangePass(e)}} className="forgetpass-codeform">

      {/* 🔄 Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl z-50">
          <div className="w-14 h-14 border-4 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {successMessage && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl z-50">
          <p>{successMessage}</p>
          <a href="/AuthPage?type=login">Click here if nothing happens.</a>
        </div>
      )}
      <div className="flex justify-center mb-3">
        <img
          src="/images/disklogo.png"
          alt="Diskly Logo"
          className="w-20 h-20 object-contain cursor-pointer"
          onClick={() => { window.location.href = "/"; }} />
      </div>

      <h2 className="text-center text-2xl text-[#63D6DD] font-semibold mb-3">
        Set New Password
      </h2>

      <p className="text-center text-[#b6aeae] mb-4">
        Set a new password for your account.
      </p>

      <div className="form-group">
        <label>New password</label>
          <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={newpassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={`
            border-cyan-400 border-2 rounded-[10px]
            bg-[#D6DCDE]
            text-black
            ${
            newpassword === ""
            ? ""
            : passwordValid
            ? "Inputvalid"
            : "Inputinvalid"
            }
              `}
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
          {newpassword && (
              <small>
                {passwordMessage}
              </small>
            )}
      </div>

      <div className="form-group">
        <label>Confirm your new password</label>
          <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={Confirmnewpassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className={`
            border-cyan-400 border-2 rounded-[10px]
            bg-[#D6DCDE]
            text-black
            ${
            Confirmnewpassword === ""
            ? ""
            : confirmpasswordValid
            ? "Inputvalid"
            : "Inputinvalid"
            }
              `}
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
          {Confirmnewpassword && (
              <small>
                {confirmpasswordMessage}
              </small>
        )}
      </div>

      <div className="button-stack">
          <button 
            type="submit"
            disabled={!confirmpasswordValid || !passwordValid}
            className="
            btn
            btn-primary
            disabled:bg-cyan-300/50
            ">
            Change Password
          </button>
        <div className="button-row">
        </div>
      </div>

      <p className="toggle-text mt-2">
        Remembered your password?{" "}
        <button type="button" className="btn btn-toggle" onClick={() => {toggleForm(); }}>
          Back to Login
        </button>
      </p>
    </form>
  );
}
