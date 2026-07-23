import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const tasks = await prisma.task.findMany({
    where:
      session.user.role === "ADMIN"
        ? undefined
        : {
            assignedToId: session.user.id,
          },
    include: {
  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
},
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only admins can create tasks" },
      { status: 403 }
    );
  }

  const { title, description, assignedToId } =
    await request.json();

  const assignedUser = await prisma.user.findUnique({
    where: {
      id: assignedToId,
    },
  });

  if (!assignedUser) {
    return NextResponse.json(
      { error: "Assigned user not found" },
      { status: 404 }
    );
  }

  if (assignedUser.role !== "MEMBER") {
    return NextResponse.json(
      { error: "Tasks can only be assigned to members" },
      { status: 400 }
    );
  }
  const task = await prisma.task.create({
    data: {
      title,
      description,
      assignedToId,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return NextResponse.json(task, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only admins can delete tasks" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("id");

  if (!taskId) {
    return NextResponse.json(
      { error: "Task ID is required" },
      { status: 400 }
    );
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return NextResponse.json({
    message: "Task deleted successfully",
  });
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json(
      { error: "Task ID and status are required" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }
  if (
    session.user.role !== "ADMIN" &&
    task.assignedToId !== session.user.id
  ) {
    return NextResponse.json(
      { error: "You can only update your own tasks" },
      { status: 403 }
    );
  }

  const updatedTask = await prisma.task.update({
    where: {
      id,
    },
    data: {
      status,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return NextResponse.json(updatedTask);
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id, title, description, assignedToId } = await request.json();

  if (!id || !title) {
    return NextResponse.json(
      { error: "Task ID and title are required" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  // Members can only edit their own tasks
  if (
    session.user.role !== "ADMIN" &&
    task.assignedToId !== session.user.id
  ) {
    return NextResponse.json(
      { error: "You can only edit your own tasks" },
      { status: 403 }
    );
  }

  // Only admins can change task assignment
  if (
    session.user.role !== "ADMIN" &&
    assignedToId &&
    assignedToId !== task.assignedToId
  ) {
    return NextResponse.json(
      { error: "Only admins can reassign tasks" },
      { status: 403 }
    );
  }

  const updatedTask = await prisma.task.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      ...(session.user.role === "ADMIN" && assignedToId
        ? { assignedToId }
        : {}),
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return NextResponse.json(updatedTask);
}

