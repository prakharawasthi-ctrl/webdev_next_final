import React from 'react';
import { Student } from '../types';

interface CardsProps {
  prop: Student;
}

const Cards: React.FC<CardsProps> = ({ prop }) => {
  return (
    <tr>
      <td>{prop.student_name}</td>
      <td>{prop.cohort}</td>
      <td>
        {prop.courses.map((course, index) => (
          <span key={index}>{course}</span>
        ))}
      </td>
      <td>{prop.date_joined}</td>
      <td>{prop.last_login}</td>
      <td>
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            backgroundColor: prop.status === "green" ? "green" : "red",
          }}
        />
      </td>
      <td>{prop.class}</td>
    </tr>
  );
};

export default Cards;
