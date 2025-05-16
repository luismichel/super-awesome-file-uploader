import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.formData();
  const file = data.get("file");
  const alias = data.get("alias");
  const maxViews = parseInt(data.get("maxViews") || "1");
  const uploadTarget = data.get("uploadTarget"); // TODO: use this value to select the correct adapter
  const iv = data.get("iv");
  const key = data.get("key");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, file.name);
  await writeFile(filePath, buffer);

  // Save metadata to DB
  await prisma.file.create({
    data: {
      name: file.name,
      alias: alias || file.name,
      encryptedPath: `/uploads/${file.name}`,
      mimeType: file.type,
      size: file.size,
      encryptionKey: key,
      encryptionIV: iv,
      maxViews,
      owner: {
        connect: {
          email: session.user.email,
        },
      },
    },
  });

  return NextResponse.json({ success: true, file: file.name });
}
