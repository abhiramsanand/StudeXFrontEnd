import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Course {
  course_name: string;
  credit: number;
}

const CreateClass: React.FC = () => {
  const navigate = useNavigate();
  const [className, setClassName] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [credit, setCredit] = useState<Course[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCourses.length === 0 || !className) {
      setError("Class name and at least one course are required.");
      return;
    }

    setError(null);

    const classData = {
      class_name: className,
      courses: selectedCourses,
      credit: credit
    };

    try {
      const token = localStorage.getItem('token')
      const response = await fetch("http://localhost:3000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization : `Bearer ${token}`
        },
        body: JSON.stringify(classData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit class data.");
      }

      setSuccess("Class data submitted successfully.");
      setClassName("");
      setSelectedCourses([]);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:3000/api/courses`, 
          {
            method : "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courses.");
        }
        const data = await response.json();
        setCourses(data.data);
        setCredit(data.data)
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseChange = (courseName: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseName)
        ? prev.filter((name) => name !== courseName)
        : [...prev, courseName]
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const navigateToNewCourse = () => {
    navigate("/courses/create");
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", fontSize: "20px", marginBottom: "20px", color: "#333" }}>
        Create Class
      </h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "green", marginBottom: "15px", textAlign: "center" }}>{success}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="class_name" style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
            Class Name
          </label>
          <input
            type="text"
            id="class_name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="Enter class name"
          />
        </div>

        <div style={{ marginBottom: "15px", position: "relative" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
            Course Names
          </label>
          <div
            onClick={toggleDropdown}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "#fff",
              position: "relative",
            }}
          >
            {selectedCourses.length > 0
              ? selectedCourses.join(", ")
              : "Select course(s)"}
          </div>
          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                width: "100%",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
                borderRadius: "4px",
              }}
            >
              {courses.map((course, index) => (
                <label
                  key={index}
                  style={{
                    display: "block",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course.course_name)}
                    onChange={() => handleCourseChange(course.course_name)}
                    style={{ marginRight: "8px" }}
                  />
                  {course.course_name}
                  &nbsp;&nbsp;&nbsp;
                  ({course.credit})
                </label>
              ))}
              <div
                onClick={navigateToNewCourse}
                style={{
                  padding: "8px",
                  color: "blue",
                  cursor: "pointer",
                  fontStyle: "italic",
                }}
              >
                + Create New Course
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            color: "#fff",
            backgroundColor: "#007BFF",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateClass;
