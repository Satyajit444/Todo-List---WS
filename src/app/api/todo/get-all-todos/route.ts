import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const todos = await prisma.todo.findMany();
    console.log("Fetched Todos:", todos);  // ✅ Debug log
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("Prisma Error:", error);  // ❌ Log the actual error
    return NextResponse.json({ error: "Failed to fetch Todos" }, { status: 500 });
  }
}
