import { IRegisterRequest } from "@/shared/types";
import { http } from "@/shared/utils/httpClient";

export const authApi = {
	register: async (data: IRegisterRequest) => {
		try {
			const response = await http.post(
				"/organization/auth/register",
				data
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};
