import React from 'react';
import { useStudents } from '../context/StudentContext';
import { Users } from 'lucide-react';

export const StudentCounter = () => {
  const { totalStudents } = useStudents();

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
      <Users size={20} />
      <span>Total Students: {totalStudents}</span>
    </div>
  );
};