import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id); // Convert string ID to number
    const { title, description, status, priority, dueDate } =
      await request.json();

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate,
      },
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Todo" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing todo ID" }, { status: 400 });
    }

    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    await prisma.todo.delete({ where: { id } });

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id); // Convert string ID to number

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo)
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching Todo" }, { status: 500 });
  }
}
