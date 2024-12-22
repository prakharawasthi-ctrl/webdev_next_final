'use client';
import React, { useState, useEffect } from 'react';
import Cards from '../components/Cards';
import { Student } from '../types';
import json_data from '../public/mock_data/students.json'; // Replace with mock data
import user_data from '../public/mock_data/user.json'; // Replace with user data

const Home: React.FC = () => {
  const [filteredData, setFilteredData] = useState(json_data);
  const [selectedCohort, setSelectedCohort] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');

  useEffect(() => {
    if (selectedCohort || selectedClass) {
      const filtered = json_data.filter(
        (student) =>
          (!selectedCohort || student.cohort === selectedCohort) &&
          (!selectedClass || student.class === selectedClass)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(json_data);
    }
  }, [selectedCohort, selectedClass]);

  return (
    <div>
      <h1>Student List</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Cohort</th>
            <th>Courses</th>
            <th>Date Joined</th>
            <th>Last Login</th>
            <th>Status</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((student, index) => (
            <Cards key={index} prop={student} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
