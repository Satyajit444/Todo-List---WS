import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const todos = await prisma.todo.findMany();

    if (!todos.length) {
      return NextResponse.json({ message: "No todos found" }, { status: 404 });
    }

    console.log("Fetched Todos:", todos);
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("Prisma Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Todos" },
      { status: 500 }
    );
  }
}
