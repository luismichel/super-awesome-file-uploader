const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // 🔐 Create users
  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      password: await bcrypt.hash("user123", 10),
      role: "user",
    },
  });

  await prisma.user.upsert({
    where: { email: "dev@test.com" },
    update: {},
    create: {
      email: "dev@test.com",
      password: await bcrypt.hash("dev123", 10),
      role: "user",
    },
  });

  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
