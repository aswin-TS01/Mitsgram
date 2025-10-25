import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher"; // keep your existing import

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { senderId, receiverId, content } = await req.json();

    console.log("📨 Incoming message data:", { senderId, receiverId, content });

    if (!senderId || !receiverId || !content) {
      console.error("❌ Missing required fields");
      return NextResponse.json(
        { error: "Missing senderId, receiverId, or content" },
        { status: 400 }
      );
    }

    // ✅ Check where the sender exists (User or Faculty)
    let sender =
      (await prisma.user.findUnique({ where: { id: senderId } })) ||
      (await prisma.faculty.findUnique({ where: { id: senderId } }));

    if (!sender) {
      console.error("❌ Sender not found in User or Faculty");
      return NextResponse.json(
        { error: "Sender not found" },
        { status: 404 }
      );
    }

    // ✅ Same check for receiver
    let receiver =
      (await prisma.user.findUnique({ where: { id: receiverId } })) ||
      (await prisma.faculty.findUnique({ where: { id: receiverId } }));

    if (!receiver) {
      console.error("❌ Receiver not found in User or Faculty");
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // ✅ Create message using senderId/receiverId directly
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });

    console.log("✅ Message saved successfully:", message);

    await pusherServer.trigger("mitsgram-channel", "new-message", message);

    return NextResponse.json(message);
  } catch (error: any) {
    console.error("💥 Message error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get("sender");
    const receiverId = searchParams.get("receiver");

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: "Missing senderId or receiverId" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }, // include replies
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("💥 Error fetching messages:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}



