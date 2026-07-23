import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

async function hash(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
  const [adminPassword, rahulPassword, sumitPassword] = await Promise.all([
    hash(process.env.SEED_ADMIN_PASSWORD ?? "admin123"),
    hash(process.env.SEED_RAHUL_PASSWORD ?? "rahul123"),
    hash(process.env.SEED_SUMIT_PASSWORD ?? "sumit123"),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const member1 = await prisma.user.upsert({
    where: { email: "rahul@kanban.com" },
    update: {},
    create: {
      name: "rahul",
      email: "rahul@kanban.com",
      password: rahulPassword,
      role: "MEMBER",
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: "sumit@kanban.com" },
    update: {},
    create: {
      name: "sumit",
      email: "sumit@kanban.com",
      password: sumitPassword,
      role: "MEMBER",
    },
  });

  const existingTaskCount = await prisma.task.count();

  if (existingTaskCount === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: "Set up project",
          description: "Initialize the Kanban project",
          status: "DONE",
          assignedToId: member1.id,
        },
        {
          title: "Build Kanban board",
          description: "Create the main task board UI",
          status: "IN_PROGRESS",
          assignedToId: member2.id,
        },
        {
          title: "Add authentication",
          description: "Implement user login",
          status: "TODO",
          assignedToId: member1.id,
        },
      ],
    });
    console.log("Tasks seeded.");
  } else {
    console.log("Tasks already exist, skipping task seed.");
  }

  console.log("Database seeded successfully!");
  console.log(`Admin: admin@example.com`);
  console.log(`Members: rahul@kanban.com, sumit@kanban.com`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });