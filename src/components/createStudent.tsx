import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Class {
  class_name: string;
}

const StudentForm: React.FC = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [className, setClassName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName || !age || !className) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(Number(age)) || Number(age) <= 0) {
      setError("Age must be a valid positive number.");
      return;
    }

    setError(null);

    const studentData = {
      studentName: studentName,
      email: email,
      age: Number(age),
      className: className,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit student data.");
      }

      setSuccess("Student data submitted successfully.");
      setStudentName("");
      setEmail("");
      setAge("");
      setClassName("");
      setPassword("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/classes/fetchall`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch classes.");
        }
        const data = await response.json();
        setClasses(data.data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchClasses();
  }, []);

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

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = e.target.value;
    setClassName(selectedClass);

    if (selectedClass === "new-class") {
      navigate("/classes/create");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}

        <div style={formGroupStyle}>
          <label htmlFor="studentName" style={labelStyle}>
            Student Name
          </label>
          <input
            type="text"
            id="student_name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={inputStyle}
            placeholder="Enter student name"
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
            placeholder="Enter student email"
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="age" style={labelStyle}>
            Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={inputStyle}
            placeholder="Enter age"
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="className" style={labelStyle}>
            Class Name
          </label>
          <select
            id="class_name"
            value={className}
            onChange={handleClassChange}
            style={inputStyle}
          >
            <option value="" disabled>
              Select class
            </option>
            {classes.map((classItem, index) => (
              <option key={index} value={classItem.class_name}>
                {classItem.class_name}
              </option>
            ))}
            <option
              value="new-class"
              style={{ color: "blue", fontStyle: "italic" }}
            >
              &#43; Create New Class
            </option>
          </select>
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

export default StudentForm;
