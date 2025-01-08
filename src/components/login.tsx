/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const styles = {
    container: {
      maxWidth: "400px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    inputGroup: {
      marginBottom: "15px",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#333",
    },
    input: {
      display: "block",
      width: "100%",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "14px",
    },
    submitButton: {
      padding: "10px 15px",
      backgroundColor: "#3498db",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      cursor: "pointer",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("role", response.data.user.role);
      if (response.data.user.role === "admin") {
        localStorage.setItem("name", response.data.user.admin_name);
      } else if (response.data.user.role === "user") {
        localStorage.setItem("name", response.data.user.student_name);
      }
      navigate("/students");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#333",
          fontWeight: "bold",
        }}
      >
        LOGIN
      </h1>
      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>
          {error}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          Login
        </button>
        <Link
          to={"/resgisteradmin"}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            color: "green",
          }}
        >
          Register Admin
        </Link>
      </form>
    </div>
  );
};

export default Login;
