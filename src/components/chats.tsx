/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Student {
  _id: string;
  student_name: string;
  age: number;
}

const Users: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [_selectedChat, setSelectedChat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const loggedInUserId = localStorage.getItem("userId");
        const response = await axios.get(
          "http://localhost:3000/api/students",
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const filteredStudents = response.data.students.filter(
          (student: Student) => student._id !== loggedInUserId
        );
        setStudents(filteredStudents);
      } catch (err) {
        setError("Failed to fetch students. Please try again later.");
      }
    };

    fetchStudents();
  }, []);

  const handleSelectChat = (studentId: string, studentName: string) => {
    setSelectedChat(studentId);
    localStorage.setItem("selectedStudent", studentId);
    localStorage.setItem("studentName", studentName);
    navigate("/messages");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>CHATS</h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {students.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {students.map((student) => (
            <li
              key={student._id}
              style={{
                padding: "10px",
                margin: "5px 0",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
                maxWidth: "300px",
                wordWrap: "break-word",
                overflow: "hidden",
                textAlign: "left",
                transition:
                  "background-color 0.3s, border-color 0.3s, font-weight 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "green";
                e.currentTarget.style.borderColor = "#007bff";
                e.currentTarget.style.fontWeight = "bold";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
                e.currentTarget.style.borderColor = "#ccc";
                e.currentTarget.style.fontWeight = "normal";
              }}
              onClick={() => handleSelectChat(student._id, student.student_name)}
            >
              {student.student_name}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading students...</p>
      )}
    </div>
  );
};

export default Users;
