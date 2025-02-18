import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
    .optional(),
});

// Create Todo
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate input data
    const parsedData = todoSchema.parse(data) || {};

    const todo = await prisma.todo.create({
      data: {
        title: parsedData.title || "",
        description: parsedData.description || "",
        status: parsedData.status,
        priority: parsedData.priority,
        dueDate: new Date(parsedData.dueDate || Date.now()),
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create Todo" },
      { status: 400 }
    );
  }
}

// Fetch all Todos
export async function GET(request: Request) {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Todos" },
      { status: 400 }
    );
  }
}

// Update Todo by ID
export async function PUT(request: Request) {
  const { id }: any = request.url.match(/\/api\/todo\/(\w+)/)?.[1] || "";
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const data = await request.json();

    const updatedData = todoSchema.parse(data);

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Todo" },
      { status: 400 }
    );
  }
}

// Delete Todo by ID
export async function DELETE(request: Request) {
  const { id }: any = request.url.match(/\/api\/todo\/(\w+)/)?.[1] || "";
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete Todo" },
      { status: 400 }
    );
  }
}
