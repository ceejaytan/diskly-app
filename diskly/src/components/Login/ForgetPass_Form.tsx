import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../API/config";

import ForgetPassFormCode from "./ForgetPass_CodeForm";

interface ForgetPassFormProps {
  toggleForm: () => void;
}

export default function ForgetPassForm({ toggleForm }: ForgetPassFormProps) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [emailMessage, setEmailMessage] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  const [Submitted, setSubmitted] = useState(false);


  const emailRegex = /^[A-Za-z0-9._+-]{3,20}@[^\s@]+\.[A-Za-z]{2,}$/;


useEffect(() => {
  if (!email) {
    setEmailMessage("");
    setEmailValid(false);
    return;
  }

  const timeout = setTimeout(async () => {
    if (!emailRegex.test(email)) {
      setEmailMessage("Invalid email");
      setEmailValid(false);
      return;
    }

    const res = await fetch(`${API_URL}/accounts/check-email?email=${email}`);
    const data = await res.json();
    if (data.Available) {
      setEmailMessage("Account with this email doesn't exist");
      setEmailValid(false);
    } else {
        if(emailMessage === "Account with this email doesn't exist"){
          setEmailMessage("maybe :)");
          setEmailValid(true);
        }else{
          setEmailMessage("");
          setEmailValid(true);
        }
    }
  }, 400);

  return () => clearTimeout(timeout);
}, [email]);

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();

    setSubmitted(true);
  }

  return (
    <>
    {!Submitted && (
    <form onSubmit={handleNext} className="forgetpass-form">
      <div className="flex justify-center mb-3">
        <img
          src="/images/disklogo.png"
          alt="Diskly Logo"
          className="w-20 h-20 object-contain cursor-pointer"
          onClick={() => { window.location.href = "/"; }}
        />
      </div>

      <h1 className="text-center text-2xl text-[#63D6DD] font-semibold mb-3">
        Diskly Account Recovery
      </h1>

      <p className="text-center text-[#b6aeae] mb-4">
        Enter your registered email address. We’ll send a recovery code.
      </p>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
            className={`
            border-cyan-400 border-2 rounded-[10px]
            bg-[#D6DCDE]
            text-black
            ${ email === ""
            ? ""
            : emailValid
            ? "Inputvalid"
            : "Inputinvalid" }
              `}
        />
          {email && (
              <small>
                {emailMessage}
              </small>
            )}
      </div>


      <div className="button-stack">
        <button 
              type="submit"
              disabled={!emailValid}
              className="btn btn-primary">
          Send Code
        </button>
      </div>

      <p className="toggle-text mt-2">
        Remembered your password?{" "}
        <button type="button" className="btn btn-toggle" onClick={toggleForm}>
          Back to Login
        </button>
      </p>
    </form>
    )}

    {Submitted && (
    <ForgetPassFormCode
    email={email}
    toggleForm={() => {setSubmitted(false); toggleForm() }}
    goback={() => {setSubmitted(false)}}
    />
    )}
  </>
  );
}
