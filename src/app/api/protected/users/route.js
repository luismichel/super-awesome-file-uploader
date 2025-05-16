import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json([], { status: 401 });

  const users = await prisma.user.findMany({
    where: { email: { not: session.user.email } },
    select: { id: true, email: true },
  });

  return NextResponse.json(users);
}
