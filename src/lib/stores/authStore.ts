import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
	id: string;
	email: string;
	// [key: string]: any; // Adjust based on your user data
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	setUser: (user: User | null) => void;
	logout: () => void;
}

const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,
			setUser: (user) => set({ user, isAuthenticated: !!user }),
			logout: () => set({ user: null, isAuthenticated: false }),
		}),
		{
			name: "auth-storage",
		}
	)
);

export default useAuthStore;
