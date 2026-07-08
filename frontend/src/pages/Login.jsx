import { useState } from "react";
import { useNavigate } from "react-router";
import { FaUserShield, FaEnvelope, FaLock } from "react-icons/fa";
import api from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();


    try {
      const res = await api.post("api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message || "Login Failed"
      );
    }


  };

  return (<div className="login-page">
    <div className="circle one"></div>
  <div className="circle two"></div>

     <div className="login-card"> <FaUserShield className="login-icon" />


    <h1>Admin Login</h1>

    <p className="login-subtitle">
      Digital Certificate Verification System
    </p>

    <form onSubmit={handleLogin}>
      <div className="input-group">
        <FaEnvelope className="input-icon" />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />
      </div>

      <div className="input-group">
        <FaLock className="input-icon" />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />
      </div>

      <button type="submit">
        Login
      </button>
    </form>

    <p className="login-footer">
      Authorized Administrators Only
    </p>
  </div>
  </div>


  );
}

export default Login;

