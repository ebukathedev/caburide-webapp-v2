import { NextResponse, NextRequest } from "next/server";

const publicRoutes = [
	"/auth/login",
	"/auth/signup",
	"/auth/reset-password",
] as const;
const protectedRoutes = [
	"/dashboard",
	"/tours",
	"/rides",
	"/driver",
	"/eats",
	"/order-history",
	"/wallet",
] as const;

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("auth_token")?.value; // Adjust based on your auth token

	// Handle index route (/)
	if (pathname === "/") {
		if (token) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	// Protect routes
	if (protectedRoutes.some((route) => pathname.startsWith(route))) {
		if (!token) {
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}
	}

	// Redirect authenticated users from public routes
	if (
		publicRoutes.includes(pathname as (typeof publicRoutes)[number]) &&
		token
	) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
