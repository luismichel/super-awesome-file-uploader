import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { fileId, recipientId, maxViews } = await req.json();

  try {
    await prisma.sharedFile.create({
      data: {
        fileId,
        recipientId,
        maxViews,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Already shared or invalid" },
      { status: 400 },
    );
  }
}
