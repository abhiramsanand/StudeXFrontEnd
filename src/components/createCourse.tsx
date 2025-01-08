import React, { useState } from "react";

const CreateCourse: React.FC = () => {
  const [courseName, setCourseName] = useState("");
  const [credit, setCredit] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseName || !credit) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(Number(credit)) || Number(credit) <= 0) {
        setError("Credit must be a valid positive number.");
        return;
      }

    setError(null);

    const courseData = {
      course_name: courseName,
      credit: Number(credit),
    };

    try {
      const token = localStorage.getItem('token')
      const response = await fetch("http://localhost:3000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization : `Bearer ${token}`
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit course data.");
      }

      setSuccess("Course data submitted successfully.");
      setCourseName("");
      setCredit("");
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
      <h2 style={titleStyle}>Create Course</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}

        <div style={formGroupStyle}>
          <label htmlFor="course_name" style={labelStyle}>
            Course Name
          </label>
          <input
            type="text"
            id="course_name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            style={inputStyle}
            placeholder="Enter course name"
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="credit" style={labelStyle}>
            Credit
          </label>
          <input
            type="number"
            id="credit"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            style={inputStyle}
            placeholder="Enter credit"
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

export default CreateCourse;
