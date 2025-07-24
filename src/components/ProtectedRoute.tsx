"use client";
import { useRouter } from "next/navigation";
import { useEffect, FC, PropsWithChildren } from "react";
import useAuthStore from "@/lib/stores/authStore";

const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
	const { isAuthenticated } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/auth/login");
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return null; // Or a loading spinner
	}

	return <>{children}</>;
};

export default ProtectedRoute;
