import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: number }> }
): Promise<Response> {
  try {
    const { params } = context;
    const { id } = await params;
    const { title, description, status, priority, dueDate } = await request.json();

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { title, description, status, priority, dueDate },
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ error: "Failed to update Todo" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest): Promise<Response> {
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

    return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
): Promise<NextResponse> {

  const { id } = await params;
  // Convert the route param from a string to a number.
  // const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json({ error: "Error fetching Todo" }, { status: 500 });
  }
}