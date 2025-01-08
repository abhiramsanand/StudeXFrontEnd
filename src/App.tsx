import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentsTable from "./components/studentTable";
import StudentDetails from "./components/studentDetails";
import CourseSelect from "./components/selectCourses";
import StudentForm from "./components/createStudent";
import CreateClass from "./components/createClass";
import CreateCourse from "./components/createCourse";
import Messages from "./components/messages"
import Login from "./components/login";
import Chat from "./components/chats"
import RegisterAdmin from "./components/registerAdmin";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/resgisteradmin" element={<RegisterAdmin />} />
        <Route path="/chats" element={<Chat />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/students" element={<StudentsTable />} />
        <Route path="/students/:id" element={<StudentDetails />} />
        <Route path="/students/select/:id" element={<CourseSelect />} />
        <Route path="/students/create" element={<StudentForm />} />
        <Route path="/classes/create" element={<CreateClass />} />
        <Route path="/courses/create" element={<CreateCourse />} />
      </Routes>
    </Router>
  );
};

export default App;
