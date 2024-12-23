import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Mock database
// let students: Student[] = [ ... ]; // Your initial mock data if needed

// TypeScript types for a student and API response
interface Student {
  id: string;
  student_name: string;
  cohort: string;
  courses: string;
  date_joined: string;
  last_login: string;
  status: string;
  class: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
  deletedStudent?: Student;
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const studentsFilePath = path.join(process.cwd(), 'public/mock_data/students.json');
  const studentsData = fs.readFileSync(studentsFilePath, 'utf-8');
  let students: Student[] = JSON.parse(studentsData); // Explicitly type `students` as `Student[]`
  
  try {
    const { id } = params;

    // Find the index of the student to delete
    const studentIndex = students.findIndex((student: Student) => student.id === id); // Explicitly type `student` as `Student`

    // Check if the student exists
    if (studentIndex === -1) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Store the student data for response before deleting
    const deletedStudent = students[studentIndex];

    // Remove the student from the mock database
    students = students.filter((student: Student) => student.id !== id); // Explicitly type `student` as `Student`

    // Respond with the deleted student data
    return NextResponse.json(
      {
        message: 'Student deleted successfully',
        deletedStudent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting student:', error);

    // Return a 500 Internal Server Error response
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Utility function to fetch all students (optional, for testing purposes)
// export async function GET(): Promise<NextResponse<Student[]>> {
//   return NextResponse.json(students, { status: 200 });
// }
