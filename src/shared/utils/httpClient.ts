import axios, {
	AxiosInstance,
	InternalAxiosRequestConfig,
	AxiosResponse,
} from "axios";
import Cookies from "js-cookie";
import "@/nprogress.css";
import NProgress from "nprogress";

// Centralized configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";

// Interface for auth object
interface AuthAccess {
	token: string;
}

// Utility to parse JSON safely
const parseJsonSafely = <T>(json: string | undefined): T | null => {
	try {
		return json ? (JSON.parse(json) as T) : null;
	} catch {
		return null;
	}
};

// Configure Axios instance
const httpClient: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true, // Enable cookies for cross-origin requests
	timeout: 10000, // Prevent hanging requests
});

export const publicHttp = axios.create({
	baseURL: "https://staging-api.caburide.com/v1",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	timeout: 10000,
});

// Request interceptor
httpClient.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		NProgress.start();

		const authAccess = Cookies.get("auth_access");
		const authObject = parseJsonSafely<AuthAccess>(authAccess);

		if (authObject?.token) {
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${authObject.token}`,
			} as InternalAxiosRequestConfig["headers"];
		}

		return config;
	},
	(error) => {
		NProgress.done();
		console.error("Request error:", error);
		return Promise.reject(error);
	}
);

// Response interceptor
httpClient.interceptors.response.use(
	(response: AxiosResponse) => {
		NProgress.done();
		return response;
	},
	(error) => {
		NProgress.done();

		if (error.response?.status === 401) {
			Cookies.remove("auth_access");
			Cookies.remove("user");
			window.location.assign("/auth/signin"); // Use signin for better UX
		}

		console.error("Response error:", error);
		return Promise.reject(error);
	}
);

// Optional: Add helper methods for common operations
export const http = {
	get: <T>(url: string, config?: InternalAxiosRequestConfig) =>
		httpClient.get<T>(url, config),
	post: <T>(
		url: string,
		data?: unknown,
		config?: InternalAxiosRequestConfig
	) => httpClient.post<T>(url, data, config),
	put: <T>(
		url: string,
		data?: unknown,
		config?: InternalAxiosRequestConfig
	) => httpClient.put<T>(url, data, config),
	delete: <T>(url: string, config?: InternalAxiosRequestConfig) =>
		httpClient.delete<T>(url, config),
};

export default httpClient;
