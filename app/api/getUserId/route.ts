import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    // Search both User and Faculty collections
    const user =
      (await prisma.user.findUnique({ where: { email } })) ||
      (await prisma.faculty.findUnique({ where: { email } }));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ id: user.id });
  } catch (error: any) {
    console.error("Error fetching user ID:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

