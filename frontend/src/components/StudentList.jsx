import { useState } from 'react'; // Import useState
import { useStudents } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Loader } from 'lucide-react';

export const StudentList = () => {
  const { students, deleteStudent, loading, error } = useStudents();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null); // Track which student is being deleted

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  const handleDelete = async (studentId) => {
    try {
      setDeletingId(studentId); // Set the ID of the student being deleted
      await deleteStudent(studentId);
    } catch (err) {
      console.error('Failed to delete student:', err);
    } finally {
      setDeletingId(null); // Reset deletingId after the operation
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Students List</h1>
        <button
          onClick={() => navigate('/add')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          Add Student
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-sm text-gray-500">
                  No students available.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.branch}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/student/${student.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/edit/${student.id}`)}
                        className="text-green-600 hover:text-green-900 ml-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        disabled={deletingId === student.id} // Disable button if deleting this student
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        {deletingId === student.id ? (
                          <Loader className="w-5 h-5 animate-spin text-red-600" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
