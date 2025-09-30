import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  toggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ toggleForm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in:", username, password);
    navigate("/home");
  };

  const handleCancel = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>

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


      <div className="button-stack">
        <button type="submit" className="btn btn-primary">
          Login
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
        Don’t have an account?{" "}
        <button type="button" className="btn btn-toggle" onClick={toggleForm}>
          Register
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
