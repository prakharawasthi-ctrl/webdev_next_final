'use client';

import React, { useState, useEffect } from 'react';
import json_data from '../public/mock_data/students.json';
import userData from '../public/mock_data/users.json';
import '../styles/globals.css';
import { AiOutlineDashboard, AiOutlineUser, AiOutlineBook, AiOutlineQuestionCircle, AiOutlineFileText, AiOutlineSetting ,AiOutlineSearch, AiOutlineFilter, AiOutlineBell} from 'react-icons/ai';

const Layout: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedCohort, setSelectedCohort] = useState<string>('');
  const [filteredData, setFilteredData] = useState(json_data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null); // Specify `any` or `null`
  const [newStudent, setNewStudent] = useState({
    id: '',
    student_name: '',
    cohort: '',
    courses: '',
    date_joined: '',
    last_login: '',
    status: '',
    class: '',
  });

  const classOptions = [...new Set(json_data.map((student) => student.class))];
  const cohortOptions = [...new Set(json_data.map((student) => student.cohort))];

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

  const handleDelete = async (student: any) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`/api/students/delete/${student.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete student');
        }

        // Update the local state by removing the deleted student
        setFilteredData(filteredData.filter((s) => s.id !== student.id)); // Ensure the correct student is removed
        alert('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  const handleUpdate = (student: any) => {
    setSelectedStudent(student);
    setNewStudent(student);
    setIsUpdateMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent && isUpdateMode) {
      alert('No student selected for update.');
      return;
    }

    try {
      if (isUpdateMode && selectedStudent) {
        const response = await fetch(`/api/students/update/${selectedStudent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newStudent),
        });

        if (!response.ok) {
          throw new Error('Failed to update student');
        }

        // Update the local state
        setFilteredData(filteredData.map((student) =>
          student.id === selectedStudent.id ? newStudent : student
        ));
        alert('Student updated successfully!');
      } else {
        const response = await fetch('/api/students/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newStudent),
        });

        if (!response.ok) {
          throw new Error('Failed to add student');
        }

        setFilteredData([...filteredData, newStudent]);
        alert('Student added successfully!');
      }

      // Reset form and close modal
      setNewStudent({
        id: '',
        student_name: '',
        cohort: '',
        courses: '',
        date_joined: '',
        last_login: '',
        status: '',
        class: '',
      });
      setIsModalOpen(false);
      setIsUpdateMode(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to ${isUpdateMode ? 'update' : 'add'} student. Please try again.`);
    }
  };

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
    <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded flex items-center">
      <AiOutlineDashboard size={20} className="mr-4" /> Dashboard
    </li>
    <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded flex items-center">
      <AiOutlineUser size={20} className="mr-4" /> Students
    </li>
    <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded flex items-center">
      <AiOutlineBook size={20} className="mr-4" /> Chapter
    </li>
    <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded flex items-center">
      <AiOutlineQuestionCircle size={20} className="mr-4" /> Help
    </li>
    <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded flex items-center">
      <AiOutlineFileText size={20} className="mr-4" /> Reports
    </li>
    <li className="mb-6 text-lg hover:bg-gray-200 cursor-pointer p-2 rounded flex items-center">
      <AiOutlineSetting size={20} className="mr-4" /> Settings
    </li>
  </ul>
</nav>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-x-auto">
          <header className="mb-0">
            <header className="mb-0">
              <header className="mb-0">
                <div className="flex items-center justify-between">
                  {/* Search Input */}
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="search-bar"
                    />
                    <AiOutlineSearch size={24} className="text-gray-600" />
                  </div>



                  {/* Icons */}
                  <div className="flex space-x-4"> {/* Reduced space between icons */}
                    <AiOutlineQuestionCircle size={24} className="text-gray-600 cursor-pointer" />
                    <AiOutlineFilter size={24} className="text-gray-600 cursor-pointer" />
                    <AiOutlineBell size={24} className="text-gray-600 cursor-pointer" />
                  </div>

                  {/* User Profile */}
                  <div className="flex items-center space-x-2"> {/* Reduced space between profile and icons */}
                    <img
                      src={userData.url} // Using the avatar URL
                      alt="User Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="text-gray-700 text-sm">{userData.name || 'User'}</span> {/* Smaller text size */}
                  </div>
                </div>
              </header>

            </header>

            <div className="controls-container">
              <div className="dropdowns">
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
              </div>

              <button
                onClick={() => {
                  setIsUpdateMode(false);
                  setSelectedStudent(null);
                  setNewStudent({
                    id: '',
                    student_name: '',
                    cohort: '',
                    courses: '',
                    date_joined: '',
                    last_login: '',
                    status: '',
                    class: '',
                  });
                  setIsModalOpen(true);
                }}
                className="p-2 bg-white text-gray-700 rounded hover:bg-gray-500 text-sm"
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
                <th className="border px-4 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((student) => (
                <tr key={student.id}>
                  <td className="border px-4 py-2">{student.student_name}</td>
                  <td className="border px-4 py-2">{student.cohort}</td>
                  <td className="border px-4 py-2">{student.courses}</td>
                  <td className="border px-4 py-2">{student.date_joined}</td>
                  <td className="border px-4 py-2">{student.last_login}</td>
                  <td className="border px-4 py-2"> <span
                    className={`inline-block w-3 h-3 rounded-full ${student.status === 'green' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                  ></span></td>
                  <td className="border px-4 py-2">{student.class}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleUpdate(student)}
                      className="text-blue-500 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h3 className="text-2xl mb-4">{isUpdateMode ? 'Update Student' : 'Add Student'}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Student Name</label>
                    <input
                      type="text"
                      name="student_name"
                      value={newStudent.student_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Cohort</label>
                    <input
                      type="text"
                      name="cohort"
                      value={newStudent.cohort}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Courses</label>
                    <input
                      type="text"
                      name="courses"
                      value={newStudent.courses}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Date Joined</label>
                    <input
                      type="date"
                      name="date_joined"
                      value={newStudent.date_joined}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Last Login</label>
                    <input
                      type="date"
                      name="last_login"
                      value={newStudent.last_login}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Status</label>
                    <input
                      type="text"
                      name="status"
                      value={newStudent.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Class</label>
                    <input
                      type="text"
                      name="class"
                      value={newStudent.class}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border rounded bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border rounded bg-blue-500 text-white"
                    >
                      {isUpdateMode ? 'Update' : 'Add'}
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
