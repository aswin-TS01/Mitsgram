import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const students = await prisma.user.findMany();
    const faculty = await prisma.faculty.findMany();

    // Mark who is who
    const formattedStudents = students.map((s) => ({
      ...s,
      role: "Student",
    }));

    const formattedFaculty = faculty.map((f) => ({
      ...f,
      role: "Faculty",
    }));

    // Combine both lists
    const allUsers = [...formattedStudents, ...formattedFaculty];

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
