import React, { useEffect, useState } from "react";
import { API_URL } from "../../API/config";

import ChangePasswordForm from "./change_password_form";

interface ForgetPassFormProps {
  email: string;
  toggleForm: () => void;
  goback: () => void;
}

export default function ForgetPassFormCode({ email, toggleForm, goback }: ForgetPassFormProps) {
  const [recoverycode, setRecoveryCode] = useState("");
  const [timer, setTimer] = useState(300);

  const [loading, setLoading] = useState(false);
  const [successMessage, seSuccessMessage] = useState("");

  const [code_verified, setCode_Verified] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  function formatTime(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }


  async function sendCode(){
    await fetch(`${API_URL}/accounts/forget-password-sendcode?email=${email}`,{
      method: "POST",
      credentials: "include",
    });
    }

const hasSentRef = React.useRef(false);

useEffect(() => {
  if (hasSentRef.current) return;
  hasSentRef.current = true;
  sendCode();
}, []);

  function handleResend() {
    setTimer(300);
    sendCode();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    seSuccessMessage("");

    const formdata = new FormData();
    formdata.append("code", recoverycode);
    formdata.append("email", email);

    const res = await fetch(`${API_URL}/accounts/forget-password-verify`, {
      method: "POST",
      credentials: "include",
      body: formdata
    });
    if (res.ok){
      setLoading(false);
      seSuccessMessage("letting you changed password...");
      setCode_Verified(true);
    }else{
      seSuccessMessage("wrong code...");
      setLoading(false);
      setTimeout(() => {
        seSuccessMessage("");
      }, 3000)
    }
  }

  return (
    <>
    {!code_verified && (
    <form onSubmit={handleSubmit} className="forgetpass-codeform">


      {/* 🔄 Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl z-50">
          <div className="w-14 h-14 border-4 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {successMessage && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl z-50">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="flex justify-center mb-3">
        <img
          src="/images/disklogo.png"
          alt="Diskly Logo"
          className="w-20 h-20 object-contain cursor-pointer"
          onClick={() => { window.location.href = "/"; }}
        />
      </div>

      <h1 className="text-center text-2xl text-[#63D6DD] font-semibold mb-3">
        Code Sent
      </h1>

      <p className="text-center text-[#b6aeae] mb-4">
        Enter the code sent to the email address {email || "null"}
      </p>

      <div className="form-group">
        <label>Enter Code</label>
        <input
          type="text"
          value={recoverycode}
          onChange={(e) => {setRecoveryCode(e.target.value.toString())}}
          required
          className="
            border-cyan-400 border-2 rounded-[10px]
            bg-[#D6DCDE]
            text-black
          "
        />
      </div>


      <div className="text-center mt-3 text-[#888]">
          <p>Code expires in <span className="font-semibold">{formatTime(timer)}</span></p>
      </div>


      <div className="button-stack">
        {timer > 0 && (
          <button 
            type="submit"
            disabled={!recoverycode}
            className="
            btn
            btn-primary
            disabled:bg-cyan-300/50
            ">
            Submit
          </button>
        )}
        {timer == 0 && (
          <button type="button" onClick={handleResend} className="btn btn-secondary mt-2">
            Resend Code
          </button>
        )}


        <div className="button-row">
          <button type="button" className="btn btn-back" onClick={() => goback()}>
            Go Back
          </button>
        </div>
      </div>

      <p className="toggle-text mt-2">
        Remembered your password?{" "}
        <button type="button" className="btn btn-toggle" onClick={() => {toggleForm(); }}>
          Back to Login
        </button>
      </p>
    </form>
    )}

    {code_verified && (
    <ChangePasswordForm
          email={email}
          code={recoverycode}
          toggleForm={() => toggleForm()}
        />
    )}
</>

  );
}
