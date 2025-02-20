import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: {
    id: string
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
  request: NextRequest,
  { params }: Props
): Promise<NextResponse> {
  // Convert id from string to number
  const id = parseInt(params.id, 10);
  
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const todo = await prisma.todo.findUnique({
      where: { id }
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json({ error: "Error fetching Todo" }, { status: 500 });
  }
}