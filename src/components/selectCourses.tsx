/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Course {
  _id: string;
  course_name: string;
  credit: number;
}

const CourseSelect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:3000/api/students/courses/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },}
      );
      if (!response.ok) {
        throw new Error("Failed to fetch courses.");
      }
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const handleCheckboxChange = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleUpdate = async () => {
    setUpdateStatus(null);
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:3000/api/students/courses/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ coursesselected: selectedCourses }),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update courses.");
      }
      setUpdateStatus("Courses updated successfully.");
    } catch (err: any) {
      setUpdateStatus(err.message || "Something went wrong while updating.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [id]);

  const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
  };
  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left" as const,
  };
  const thStyle = { backgroundColor: "#f4f4f4", fontWeight: "bold" };
  const titleStyle = {
    textAlign: "center" as const,
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  };
  const errorStyle = { color: "red", textAlign: "center" as const };
  const loadingStyle = { textAlign: "center" as const, color: "#555" };
  const statusStyle = {
    textAlign: "center" as const,
    color: updateStatus?.includes("successfully") ? "green" : "red",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Available Courses</h1>
      {loading ? (
        <p style={loadingStyle}>Loading...</p>
      ) : error ? (
        <p style={errorStyle}>{error}</p>
      ) : courses.length === 0 ? (
        <p style={errorStyle}>No courses found.</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr>
                <th style={{ ...thTdStyle, ...thStyle }}>Select</th>
                <th style={{ ...thTdStyle, ...thStyle }}>Course Name</th>
                <th style={{ ...thTdStyle, ...thStyle }}>Credits</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={course._id}
                  style={
                    index % 2 === 0
                      ? { backgroundColor: "#f9f9f9" }
                      : { backgroundColor: "#ffffff" }
                  }
                >
                  <td style={thTdStyle}>
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => handleCheckboxChange(course._id)}
                    />
                  </td>
                  <td style={thTdStyle}>{course.course_name}</td>
                  <td style={thTdStyle}>{course.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={handleUpdate}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Update
            </button>
          </div>
          {updateStatus && <p style={statusStyle}>{updateStatus}</p>}
        </>
      )}
    </div>
  );
};

export default CourseSelect;
