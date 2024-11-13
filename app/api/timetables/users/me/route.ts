// app/api/timetables/users/me/route.ts
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";

export async function GET() {
  try {
    // Use the validateRequest helper
    const user = await validateRequest();

    // If validateRequest didn't return a NextResponse (error), we have a valid user
    if (user instanceof NextResponse) {
      return user; // This is the error response from validateRequest
    }

    // Reuse the logic from [userId] route
    const response = await fetch(`/api/timetables/users/${user.id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user timetable");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch user timetable:", error);
    return NextResponse.json(
      { error: "Failed to fetch user timetable" },
      { status: 500 }
    );
  }
}
