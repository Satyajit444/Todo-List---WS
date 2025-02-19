import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id, title, description, status, priority, dueDate } = await request.json();

    if (![title, description, status, priority, dueDate].every(Boolean)) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return NextResponse.json({ error: "Invalid due date format" }, { status: 400 });
    }

    let todo;
    if (id) {
      // Update existing todo
      todo = await prisma.todo.update({
        where: { id },
        data: { title, description, status, priority, dueDate: parsedDueDate },
      });
    } else {
      // Create new todo
      todo = await prisma.todo.create({
        data: { title, description, status, priority, dueDate: parsedDueDate },
      });
    }

    return NextResponse.json(todo, { status: id ? 200 : 201 });
  } catch (error) {
    console.error("Error creating/updating Todo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
