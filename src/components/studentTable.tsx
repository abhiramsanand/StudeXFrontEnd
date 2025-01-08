/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import handleLogout from "./logoutButton";

interface Student {
  _id: string;
  student_name: string;
  age: number;
}

const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async (searchQuery: string = "") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to continue.");
      }
      const response = await fetch(
        `http://localhost:3000/api/students?search=${encodeURIComponent(
          searchQuery
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch students.");
      }
      const data = await response.json();
      setStudents(data.students);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(search);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const uname = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "20px auto",
      padding: "20px",
      backgroundColor: "#ffffff",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      borderRadius: "16px",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      padding: "10px 0",
    },
    title: {
      fontSize: "32px",
      color: "#2c3e50",
      margin: "0",
      fontWeight: "bold",
      letterSpacing: "-0.5px",
    },
    createButton: {
      padding: "12px 24px",
      backgroundColor: "#3498db",
      color: "white",
      border: "none",
      borderRadius: "8px",
      textDecoration: "none",
      fontWeight: "600",
      transition: "all 0.3s ease",
      cursor: "pointer",
      boxShadow: "0 4px 6px rgba(52, 152, 219, 0.2)",
    },
    th: {
      backgroundColor: "#f8f9fa",
      color: "#2c3e50",
      padding: "20px 15px",
      textAlign: "center" as const,
      fontWeight: "600",
      borderBottom: "2px solid #e9ecef",
      position: "sticky" as const,
      top: "0",
      zIndex: "10",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    td: {
      padding: "16px 15px",
      borderBottom: "1px solid #e9ecef",
      color: "#2c3e50",
      textAlign: "center" as const,
    },
    td1: {
      padding: "16px 15px",
      borderBottom: "1px solid #e9ecef",
      color: "#2c3e50",
      display: "flex",
      justifyContent: "center",
      gap: "12px",
    },
    selectButton: {
      padding: "8px 16px",
      backgroundColor: "#2ecc71",
      color: "white",
      border: "none",
      borderRadius: "6px",
      textDecoration: "none",
      fontSize: "14px",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 4px rgba(46, 204, 113, 0.2)",
    },
    loadingContainer: {
      textAlign: "center" as const,
      padding: "40px",
      color: "#666",
      fontSize: "18px",
    },
    errorContainer: {
      textAlign: "center" as const,
      padding: "40px",
      color: "#e74c3c",
      fontSize: "18px",
    },
    row: {
      transition: "all 0.3s ease",
    },
  };

  const scrollbarStyles = `
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 5px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 5px;
      border: 2px solid #f1f1f1;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `;

  if (loading) {
    return <div style={styles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.errorContainer}>{error}</div>;
  }

  return (
    <>
      <h1
        style={{
          position: "absolute",
          color: "green",
          margin: "0px 30px",
        }}
      >
        <span style={{ color: "black" }}>Hello, </span>
        <br />
        {uname}!
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "10px",
          marginTop: "10px",
        }}
      >
        {role !== "admin" && (
          <Link
            to="/chats"
            style={{
              alignSelf: "flex-end",
              marginRight: "30px",
              border: "1px solid green",
              borderRadius: "5px",
              padding: "8px 8px",
              color: "green",
            }}
          >
            Chat with users
          </Link>
        )}
        <Link
          to="/"
          style={{
            alignSelf: "flex-end",
            border: "1px solid red",
            borderRadius: "5px",
            padding: "8px 8px",
            color: "red",
          }}
          onClick={handleLogout}
        >
          Logout
        </Link>
      </div>
      <div style={styles.container}>
        <style>{scrollbarStyles}</style>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Students List</h1>
          </div>
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={handleSearchChange}
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              width: "300px",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              {role === "admin" ? (
                <Link
                  to="/courses/create"
                  style={{
                    ...styles.createButton,
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#2980b9";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 12px rgba(52, 152, 219, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(52, 152, 219, 0.2)";
                  }}
                >
                  Create Course
                </Link>
              ) : (
                <div
                  style={{
                    ...styles.createButton,
                    backgroundColor: "#d3d3d3",
                    color: "#a9a9a9",
                    cursor: "not-allowed",
                    pointerEvents: "none",
                    boxShadow: "none",
                  }}
                >
                  Create Course
                </div>
              )}

              {role === "admin" ? (
                <Link
                  to="/classes/create"
                  style={{
                    ...styles.createButton,
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#2980b9";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 12px rgba(52, 152, 219, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(52, 152, 219, 0.2)";
                  }}
                >
                  Create Class
                </Link>
              ) : (
                <div
                  style={{
                    ...styles.createButton,
                    backgroundColor: "#d3d3d3",
                    color: "#a9a9a9",
                    cursor: "not-allowed",
                    pointerEvents: "none",
                    boxShadow: "none",
                  }}
                >
                  Create Class
                </div>
              )}

              {role === "admin" ? (
                <Link
                  to="/students/create"
                  style={{
                    ...styles.createButton,
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#2980b9";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 12px rgba(52, 152, 219, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(52, 152, 219, 0.2)";
                  }}
                >
                  Create Student
                </Link>
              ) : (
                <div
                  style={{
                    ...styles.createButton,
                    backgroundColor: "#d3d3d3",
                    color: "#a9a9a9",
                    cursor: "not-allowed",
                    pointerEvents: "none",
                    boxShadow: "none",
                  }}
                >
                  Create Student
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            maxHeight: "calc(100vh - 170px)",
            overflowX: "hidden",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            background: "white",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0",
              backgroundColor: "white",
            }}
          >
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Age</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student._id}
                  style={{
                    ...styles.row,
                    backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#f1f8ff";
                    e.currentTarget.style.transform = "scale(1.005)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? "#f8f9fa" : "white";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <td style={styles.td}>{student.student_name}</td>
                  <td style={styles.td}>{student.age}</td>
                  <td style={styles.td1}>
                    <Link
                      to={`/students/${student._id}`}
                      style={styles.selectButton}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#27ae60";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(46, 204, 113, 0.3)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#2ecc71";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 4px rgba(46, 204, 113, 0.2)";
                      }}
                    >
                      View Details
                    </Link>
                    {student._id === userId && (
                      <Link
                        to={`/students/select/${student._id}`}
                        style={styles.selectButton}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#27ae60";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 8px rgba(46, 204, 113, 0.3)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#2ecc71";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 2px 4px rgba(46, 204, 113, 0.2)";
                        }}
                      >
                        Select Course
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StudentsTable;
