import React, { useState } from "react";

const RegisterAdmin: React.FC = () => {
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminName) {
      setError("All fields are required.");
      return;
    }

    setError(null);

    const studentData = {
      adminName: adminName,
      email: email,
      password: password,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/registeradmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit student data.");
      }

      setSuccess("Admin data submitted successfully.");
      setAdminName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const containerStyle = {
    maxWidth: "400px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  };

  const titleStyle = {
    textAlign: "center" as const,
    fontSize: "20px",
    marginBottom: "20px",
    color: "#333",
  };

  const formGroupStyle = {
    marginBottom: "15px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold" as const,
    color: "#555",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
  };

  const errorStyle = {
    color: "red",
    marginBottom: "15px",
    textAlign: "center" as const,
  };

  const successStyle = {
    color: "green",
    marginBottom: "15px",
    textAlign: "center" as const,
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Admin Registration</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}
        <div style={formGroupStyle}>
          <label htmlFor="studentName" style={labelStyle}>
            Admin Name
          </label>
          <input
            type="text"
            id="admin_name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            style={inputStyle}
            placeholder="Enter admin name"
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="Enter admin email"
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="Enter password"
          />
        </div>
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor =
              buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor =
              buttonStyle.backgroundColor)
          }
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterAdmin;
