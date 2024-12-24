import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
  updatedStudent?: Student;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const studentsFilePath = path.join(
    process.cwd(),
    "public/mock_data/students.json"
  );
  const studentsData = fs.readFileSync(studentsFilePath, "utf-8");
  const students: Student[] = JSON.parse(studentsData);

  try {
    const { id } = params;

    const body = await request.json();
    const studentIndex = students.findIndex((student) => student.id === id);

    if (studentIndex === -1) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    students[studentIndex] = {
      ...students[studentIndex],
      ...body,
    };

    fs.writeFileSync(
      studentsFilePath,
      JSON.stringify(students, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      {
        message: "Student updated successfully",
        updatedStudent: students[studentIndex],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
