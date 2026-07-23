import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const memberPassword = await bcrypt.hash("member123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const member1 = await prisma.user.create({
    data: {
      name: "rahul",
      email: "rahul@kanban.com",
      password: memberPassword,
      role: "MEMBER",
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: "sumit",
      email: "sumit@kanban.com",
      password: memberPassword,
      role: "MEMBER",
    },
  });

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

  console.log("Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });