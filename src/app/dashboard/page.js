import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UserFilesPage from "@/components/file-manager/fileList";
import UploadButton from "@/components/file-manager/uploadButton";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userEmail = session.user.email;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const myFiles = await prisma.file.findMany({
    where: { ownerId: user.id },
    include: {
      sharedWith: {
        include: {
          recipient: {
            select: { email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const sharedFiles = await prisma.sharedFile.findMany({
    where: { recipientId: user.id },
    include: {
      file: {
        include: {
          owner: { select: { email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] items-start sm:items-start">
        <UserFilesPage myFiles={myFiles} sharedFiles={sharedFiles} />
        <UploadButton />
      </main>
    </div>
  );
}
