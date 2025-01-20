import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StudentProvider } from './context/StudentContext';
import { StudentList } from './components/StudentList';
import { StudentDetail } from './components/StudentDetail';
import { StudentForm } from './components/StudentForm';
import { StudentCounter } from './components/StudentCounter';

function App() {
  return (
    <StudentProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/student/:id" element={<StudentDetail />} />
            <Route path="/add" element={<StudentForm mode="add" />} />
            <Route path="/edit/:id" element={<StudentForm mode="edit" />} />
          </Routes>
          <StudentCounter />
        </div>
      </Router>
    </StudentProvider>
  );
}

export default App;