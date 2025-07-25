import { ICountry } from "@/shared/types";
import { publicHttp } from "@/shared/utils/httpClient";

export const publicApi = {
	fetchCountries: async (): Promise<ICountry[]> => {
		try {
			const response = await publicHttp.get<{ data: ICountry[] }>(
				"/public/countries"
			);
			const countries = response?.data?.data || [];

			// Deduplicate by ISO code
			const uniqueCountries = countries.filter(
				(country, index, self) =>
					index === self.findIndex((c) => c.iso === country.iso)
			);

			return uniqueCountries;
		} catch (error) {
			console.error("Error in fetching countries", error);
			return [];
		}
	},
};
