import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const StudentContext = createContext(undefined);

const API_URL = 'http://localhost:5000';

// eslint-disable-next-line react/prop-types
export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/students`);
      setStudents(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching students');
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (student) => {
    try {
      await axios.post(`${API_URL}/api/students`, student);
      await fetchStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add student');
      throw err;
    }
  };

  const updateStudent = async (id, updatedData) => {
    try {
      await axios.put(`${API_URL}/api/students/${id}`, updatedData);
      await fetchStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student');
      throw err;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/students/${id}`);
      await fetchStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student');
      throw err;
    }
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        totalStudents: students.length,
        loading,
        error,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
