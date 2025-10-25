import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const faculty = await prisma.faculty.findMany();
  return NextResponse.json(faculty);
}
