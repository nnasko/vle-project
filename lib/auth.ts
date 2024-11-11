/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET || "iloveowen";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}

// Set JWT token in cookie
export function setAuthCookie(token: string) {
  cookies().set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
}

// Remove JWT token from cookie
export function removeAuthCookie() {
  cookies().delete("auth-token");
}

// Get user from token
export async function getCurrentUser() {
  const token = cookies().get("auth-token")?.value;
  if (!token) return null;

  try {
    const payload = await decrypt(token);
    if (!payload) return null;

    return payload;
  } catch (error) {
    return null;
  }
}

// Auth middleware helper
export async function validateRequest() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return user;
}
