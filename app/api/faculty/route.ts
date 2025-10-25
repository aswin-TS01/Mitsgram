import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password, department, designation, specialization } = await req.json();

    const existingFaculty = await prisma.faculty.findUnique({
      where: { email },
    });

    if (existingFaculty) {
      return NextResponse.json({ error: "Faculty already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFaculty = await prisma.faculty.create({
      data: {
        name,
        email,
        password: hashedPassword,
        department,
        designation,
        specialization,
      },
    });

    return NextResponse.json(newFaculty);
  } catch (error) {
    console.error("Faculty registration error:", error);
    return NextResponse.json({ error: "Failed to register faculty" }, { status: 500 });
  }
}
