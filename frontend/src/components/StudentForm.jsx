import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { ArrowLeft } from 'lucide-react';

export const StudentForm = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addStudent, updateStudent, students } = useStudents();

  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    address: '',
    admission_year: new Date().getFullYear(),
  });

  const [loading, setLoading] = useState(false);  // Loading state to track form submission or data fetch

  useEffect(() => {
    if (mode === 'edit' && id) {
      const student = students.find((s) => s.id === id);
      if (student) {
        setFormData({
          name: student.name,
          branch: student.branch,
          address: student.address,
          admission_year: student.admission_year,
        });
      }
    }
  }, [mode, id, students]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading state to true when the form is being submitted

    try {
      if (mode === 'add') {
        await addStudent(formData);
      } else if (mode === 'edit' && id) {
        await updateStudent(id, formData);
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to save student:', err);
    } finally {
      setLoading(false);  // Set loading state to false after the operation completes
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to List
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {mode === 'add' ? 'Add New Student' : 'Edit Student'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            {mode === 'add' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Admission Year</label>
                <input
                  type="number"
                  value={formData.admission_year}
                  onChange={(e) => setFormData({ ...formData, admission_year: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}  // Disable button when loading
              >
                {loading ? 'Saving...' : mode === 'add' ? 'Add Student' : 'Update Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
