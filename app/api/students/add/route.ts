import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const studentsFilePath = path.join(process.cwd(), 'public/mock_data/students.json');
    const newStudent = await request.json();

    // Validate the new student data
    if (!newStudent.student_name || !newStudent.cohort || !newStudent.class) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Read existing data
    const studentsData = fs.readFileSync(studentsFilePath, 'utf-8');
    const students = JSON.parse(studentsData);

    // Add the new student
    students.push(newStudent);

    // Write updated data back to file
    fs.writeFileSync(studentsFilePath, JSON.stringify(students, null, 2));

    return NextResponse.json(
      { message: 'Student added successfully', data: newStudent },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating students.json:', error);
    return NextResponse.json(
      { 
        message: 'Failed to add student', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}