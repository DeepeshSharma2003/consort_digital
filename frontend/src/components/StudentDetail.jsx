import { useParams, useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { ArrowLeft, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';

export const StudentDetail = () => {
  const { id } = useParams();
  const { students } = useStudents();
  const navigate = useNavigate();
  const [student, setStudent] = useState({})

  useEffect(()=>{

    const stu = students.find(s => s.id === Number(id));
    console.log(stu)

    if (!stu) {
      return
    }
    setStudent(stu)

  }, [students])

  useEffect(()=>{
  }, [student])

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to List
            </button>
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={20} />
              Edit Student
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Details</h1>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Student ID:</div>
              <div className="font-medium">{student?.id}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Name:</div>
              <div className="font-medium">{student?.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Branch:</div>
              <div className="font-medium">{student?.branch}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Address:</div>
              <div className="font-medium">{student?.address}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Admission Year:</div>
              <div className="font-medium">{student?.admission_year}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};