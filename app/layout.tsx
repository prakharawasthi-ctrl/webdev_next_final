'use client';

import React, { useState, useEffect } from 'react';
import json_data from '../public/mock_data/students.json';
import '../styles/globals.css';

const Layout: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedCohort, setSelectedCohort] = useState<string>('');
  const [filteredData, setFilteredData] = useState(json_data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    student_name: '',
    cohort: '',
    courses: '',
    date_joined: '',
    last_login: '',
    status: '',
    class: '',
  });

  // Existing code for classOptions and cohortOptions remains the same
  const classOptions = [...new Set(json_data.map((student) => student.class))];
  const cohortOptions = [...new Set(json_data.map((student) => student.cohort))];

  // Existing useEffect for filtering remains the same
  useEffect(() => {
    let data = json_data;
    if (selectedClass) {
      data = data.filter((student) => student.class === selectedClass);
    }
    if (selectedCohort) {
      data = data.filter((student) => student.cohort === selectedCohort);
    }
    setFilteredData(data);
  }, [selectedClass, selectedCohort]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/students/add', {  // Update this URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add student');
      }
  
      const result = await response.json();
      console.log('Student added successfully:', result);
  
      // Update the local data state
      setFilteredData([...filteredData, newStudent]);
  
      // Reset form and close modal
      setNewStudent({
        student_name: '',
        cohort: '',
        courses: '',
        date_joined: '',
        last_login: '',
        status: '',
        class: '',
      });
      setIsModalOpen(false);
  
      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please try again.');
    }
  };
  // =================================

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My Next.js App</title>
      </head>
      <body className="flex min-h-screen bg-gray-100">
        {/* Left Sidebar / Navbar */}
        <nav className="w-1/4 bg-white text-gray-700 p-6 h-full">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">Quyl</h2>
          <ul>
            <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded">Dashboard</li>
            <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded">Students</li>
            <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded">Chapter</li>
            <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded">Help</li>
            <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded">Reports</li>
            <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded">Settings</li>
          </ul>
        </nav>

        {/* Main Content Area (Table and Filters) */}
        <main className="flex-1 p-8 overflow-x-auto">
          <header className="mb-8">
            {/* Filters (Dropdowns) */}
            <div className="flex space-x-4 mb-4">
              {/* Class Dropdown */}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="p-2 border rounded bg-white text-gray-700 text-sm"
              >
                <option value="">Select Class</option>
                {classOptions.map((classOption, index) => (
                  <option key={index} value={classOption}>
                    {classOption}
                  </option>
                ))}
              </select>

              {/* Cohort Dropdown */}
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="p-2 border rounded bg-white text-gray-700 text-sm"
              >
                <option value="">Select Cohort</option>
                {cohortOptions.map((cohortOption, index) => (
                  <option key={index} value={cohortOption}>
                    {cohortOption}
                  </option>
                ))}
              </select>

              {/* Add Student Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 bg-white text-gray-700 rounded hover:bg-gray-500 text-sm flex justify-end"
              >
                + Add Student
              </button>
            </div>
          </header>

          {/* Table */}
          <table className="w-full table-auto border-separate border-spacing-0">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-3 text-left text-gray-700">Student Name</th>
                <th className="border px-4 py-3 text-left text-gray-700">Cohort</th>
                <th className="border px-4 py-3 text-left text-gray-700">Courses</th>
                <th className="border px-4 py-3 text-left text-gray-700">Date Joined</th>
                <th className="border px-4 py-3 text-left text-gray-700">Last Login</th>
                <th className="border px-4 py-3 text-left text-gray-700">Status</th>
                <th className="border px-4 py-3 text-left text-gray-700">Class</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((student, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{student.student_name}</td>
                  <td className="border px-4 py-2">{student.cohort}</td>
                  <td className="border px-4 py-2">{student.courses}</td>
                  <td className="border px-4 py-2">{student.date_joined}</td>
                  <td className="border px-4 py-2">{student.last_login}</td>
                  <td className="border px-4 py-2">{student.status}</td>
                  <td className="border px-4 py-2">{student.class}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Student Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-10">
              <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
                <form onSubmit={handleSubmit}>
                  <label className="block text-sm font-medium mb-2">Student Name</label>
                  <input
                    type="text"
                    name="student_name"
                    value={newStudent.student_name}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-2 border rounded"
                    required
                  />
                  <label className="block text-sm font-medium mb-2">Cohort</label>
                  <input
                    type="text"
                    name="cohort"
                    value={newStudent.cohort}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-2 border rounded"
                    required
                  />
                  <label className="block text-sm font-medium mb-2">Courses</label>
                  <input
                    type="text"
                    name="courses"
                    value={newStudent.courses}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-2 border rounded"
                    required
                  />
                  <label className="block text-sm font-medium mb-2">Date Joined</label>
                  <input
                    type="date"
                    name="date_joined"
                    value={newStudent.date_joined}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-2 border rounded"
                    required
                  />
                  <label className="block text-sm font-medium mb-2">Last Login</label>
                  <input
                    type="date"
                    name="last_login"
                    value={newStudent.last_login}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-2 border rounded"
                    required
                  />
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={newStudent.status}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-2 border rounded"
                    required
                  />
                  <label className="block text-sm font-medium mb-2">Class</label>
                  <input
                    type="text"
                    name="class"
                    value={newStudent.class}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-2 border rounded"
                    required
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                      Save Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </body>
    </html>
  );
};

export default Layout;
