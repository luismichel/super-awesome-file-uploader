import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { fileId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user)
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });

  // Fetch the file and sharing record
  const shared = await prisma.sharedFile.findFirst({
    where: {
      fileId,
      recipientId: user.id,
    },
    include: {
      file: true,
    },
  });

  const isOwner = await prisma.file.findFirst({
    where: {
      id: fileId,
      ownerId: user.id,
    },
  });
  console.log("isOwner", isOwner);
  console.log("shared", shared);
  console.log("Looking for file with id:", fileId, "and ownerId:", user.id);

  const file = shared?.file || isOwner;

  if (!file) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // If not owner, validate view limit
  if (shared) {
    if (shared.views >= shared.maxViews) {
      const fsPath = path.join(
        process.cwd(),
        "public",
        shared.file.encryptedPath,
      );

      try {
        // 1. Delete the physical file
        await fs.promises.unlink(fsPath);
      } catch (err) {
        console.error("⚠️ Failed to delete file from disk:", fsPath, err);
      }

      try {
        // 2. Delete all sharedFile entries for this file
        await prisma.sharedFile.deleteMany({
          where: { fileId: shared.fileId },
        });

        // 3. Delete the file record from DB
        await prisma.file.delete({
          where: {
            id: shared.fileId,
            ownerId: shared.file.ownerId, // this ensures safety
          },
        });
      } catch (err) {
        console.error("⚠️ Failed to delete file records from DB:", err);
      }

      return NextResponse.json(
        { error: "File deleted after max views" },
        { status: 410 },
      );
    }

    // Increment view count
    await prisma.sharedFile.update({
      where: {
        fileId_recipientId: {
          fileId,
          recipientId: user.id,
        },
      },
      data: {
        views: { increment: 1 },
      },
    });
  }

  // Load encrypted file from disk
  console.log(file);
  const filePath = path.join(process.cwd(), "public", file.encryptedPath);
  const encryptedData = await readFile(filePath);

  return new NextResponse(encryptedData, {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `attachment; filename="${file.name}"`,
      "X-Encryption-Key": file.encryptionKey,
      "X-Encryption-IV": file.encryptionIV,
    },
  });
}
