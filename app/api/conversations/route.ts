import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // For demo: fetch all unique receiverIds that have messages
    const messages = await prisma.message.findMany();
    const uniqueIds = [...new Set(messages.map(m => m.receiverId))];
    const users = await prisma.user.findMany({ where: { id: { in: uniqueIds } } });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Failed to load inbox" }, { status: 500 });
  }
}
