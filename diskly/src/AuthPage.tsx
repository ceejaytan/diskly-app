import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      console.log("Logging in:", username, password);
    } else {
      console.log("Registering:", {
        fullName,
        username,
        email,
        birthday,
        contact,
        password,
        confirmPassword,
      });
    }

    navigate("/home");
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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Sign In" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        {isLogin ? (
          <>
            {/* SIGN IN FORM */}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <>
            {/* REGISTRATION FORM */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
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
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" required /> I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terms-link"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
          </>
        )}

        {/* BUTTONS */}
        <div className="button-group">
          <button type="submit" className="btn">
            {isLogin ? "Login" : "Register"}
          </button>
          <button
            type="button"
            className="btn btn-clear"
            onClick={handleCancel}
          >
            Clear
          </button>
        </div>

        <button type="button" className="btn btn-back" onClick={handleGoBack}>
          Go Back
        </button>
      </form>

      <p className="toggle-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="btn btn-toggle"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
