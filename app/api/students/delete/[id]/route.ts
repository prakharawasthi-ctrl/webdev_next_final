import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
  let students: Student[] = JSON.parse(studentsData);

  try {
    const { id } = params;
    const studentIndex = students.findIndex((student) => student.id === id);

    if (studentIndex === -1) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const deletedStudent = students[studentIndex];
    students = students.filter((student) => student.id !== id);
    fs.writeFileSync(studentsFilePath, JSON.stringify(students, null, 2), 'utf-8');

    return NextResponse.json(
      {
        message: 'Student deleted successfully',
        deletedStudent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
