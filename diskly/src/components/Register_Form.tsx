import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SendRegister, CheckUsername, CheckEmail } from "./Register_script";
import { API_URL } from "../API/config";

interface RegisterFormProps {
  toggleForm: () => void;
}



const RegisterForm: React.FC<RegisterFormProps> = ({ toggleForm }) => {
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");


  const [usernameMessage, setUsernameMessage] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const [confirmpasswordMessage, setConfirmPasswordMessage] = useState("");
  const [confirmpasswordValid, setConfirmPasswordValid] = useState(false);

  const [contactMessage, setContactMessage] = useState("");
  const [contactValid, setContactValid] = useState(false);

  const [fullnameMessage, setFullNameMessage] = useState("");
  const [fullnameValid, setFullNameValid] = useState(false);

  const [birthdayMessage, setBirthdayMessage] = useState("");
  const [birthdayValid, setBirthdayValid] = useState(true);
  
  const navigate = useNavigate();


  const fullnameRegex = /^(?:[A-Za-z]\.|[A-Za-z][A-Za-z'\-]*)(?: (?:[A-Za-z]\.|[A-Za-z][A-Za-z'\-]*)){1,3}$/
  const usernameRegex = /^(?=[A-Za-z0-9_]{3,20}$)(?!.*_$)(?!.*__)(?=(?:.*[A-Za-z]){3,})[A-Za-z][A-Za-z0-9_]{2,20}$/;
  const emailRegex = /^[A-Za-z0-9._+-]{3,20}@[^\s@]+\.[A-Za-z]{2,}$/;
  const contactRegex = /^(?:\+639|09)\d{9}$/

useEffect(() => {
    if (!fullname) {
      setFullNameMessage("");
      setFullNameValid(false);
    }
    if (!fullnameRegex.test(fullname)){
      setFullNameMessage("Invalid Full Name ( e.g John F. Doe )");
      setFullNameValid(false);
    }else {
      setFullNameMessage("");
      setFullNameValid(true);
    }

  })


useEffect(() => {
  if (!username) {
    setUsernameMessage("");
    setUsernameValid(false);
    return;
  }

  const timeout = setTimeout(async () => {
    if (!usernameRegex.test(username)) {
      setUsernameMessage("✘ Invalid username");
      setUsernameValid(false);
      return;
    }

    const res = await fetch(`${API_URL}/accounts/check-username?username=${username}`);
    const data = await res.json();
    if (data.Available) {
      setUsernameMessage("Username available");
      setUsernameValid(true);
    } else {
      setUsernameMessage("Username taken");
      setUsernameValid(false);
    }
  }, 400);

  return () => clearTimeout(timeout);
}, [username]);


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
      setEmailMessage("Email available");
      setEmailValid(true);
    } else {
      setEmailMessage("Email taken");
      setEmailValid(false);
    }
  }, 400);

  return () => clearTimeout(timeout);
}, [email]);


useEffect(() => {
    if(!contact){
      setContactMessage("")
      setContactValid(false);
    }
    if(!contactRegex.test(contact)) {
      setContactMessage("Invalid Contact! example: 09232404697")
      setContactValid(false)
    } else {
      setContactMessage("")
      setContactValid(true)
    }

  }, [contact])

  useEffect(() => {
    if (!password) {
      setPasswordMessage("");
      setPasswordValid(false);
      return;
    }

    if (password.length < 6) {
      setPasswordMessage("Password must be at least 6 characters");
      setPasswordValid(false);
    } else {
      setPasswordMessage("");
      setPasswordValid(true);
    }
  }, [password]);

  useEffect(() => {
    if (!confirmpassword) {
      setConfirmPasswordMessage("");
      setConfirmPasswordValid(false);
      return;
    } else if (confirmpassword !== password) {
      setConfirmPasswordMessage("Passwords do not match");
      setConfirmPasswordValid(false);
    } else {
      setConfirmPasswordMessage("");
      setConfirmPasswordValid(true);
    }
  }, [confirmpassword, password]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!usernameValid) {
      alert("Please enter a valid and available username.");
      return;
    }

    if (!emailValid) {
      alert("Please enter a valid and available email.");
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    console.log("Registering:", {
      fullname,
      username,
      email,
      birthday,
      contact,
      password,
      confirmpassword,
    });

    const ok = await SendRegister({
      fullname,
      username,
      email,
      birthday,
      contact,
      password,
      confirmpassword,
    });

    if (ok) navigate("/home");
  };

  const handleCancel = () => {
    setFullName("");
    setUsername("");
    setEmail("");
    setBirthday("");
    setContact("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
          required
          className={
            fullname === ""
            ? ""
            : fullnameValid
              ? "Inputvalid"
              : "Inputinvalid"
          }
        />
          {fullname && (
              <small>
                {fullnameMessage}
              </small>
            )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={
                username === ""
                  ? ""
                  : usernameValid
                  ? "Inputvalid"
                  : "Inputinvalid"
              }
          />
          {username && (
              <small className={usernameValid ? "message-valid" : "message-invalid"}>
              {usernameMessage}
              </small>
            )}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={
                email === ""
                  ? ""
                  : emailValid
                  ? "Inputvalid"
                  : "Inputinvalid"
              }
          />
          {email && (
              <small>
                {emailMessage}
              </small>
            )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Birthday</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Number ( PH )</label>
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            className={
              contact === ""
              ? ""
              : contactValid
                ? "Inputvalid"
                : "Inputinvalid"
            }
          />
          {contact && (
              <small>
                {contactMessage}
              </small>
            )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={
                password === ""
                  ? ""
                  : passwordValid
                  ? "Inputvalid"
                  : "Inputinvalid"
              }
          />
          {password && (
              <small>
                {passwordMessage}
              </small>
            )}

        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={
              password === "" ? "" :
              confirmpassword === "" ? "" : 
              confirmpasswordValid
                ? "Inputvalid"
                : "Inputinvalid"
            }
          />
        </div>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input type="checkbox" required /> I agree to the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="terms-link">
            Terms and Conditions
          </a>
        </label>
      </div>

      <div className="button-stack">
        <button type="submit" className="btn btn-primary"
        disabled={!usernameValid || !emailValid || password.length < 6 || password !== confirmpassword}>
          Register
        </button>

        <div className="button-row">
          <button type="button" className="btn btn-clear" onClick={handleCancel}>
            Clear
          </button>
          <button type="button" className="btn btn-back" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>

      <p className="toggle-text">
        Already have an account?{" "}
        <button type="button" className="btn btn-toggle" onClick={toggleForm}>
          Login
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;
