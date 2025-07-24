import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import PhoneNumberInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
	error?: string;
	className?: string;
}

const PhoneInputField: React.FC<PhoneInputProps> = ({
	value,
	onChange,
	placeholder = "Enter phone number",
	label,
	error,
	className,
}) => {
	const [defaultCountry, setDefaultCountry] = useState<string>("US");

	useEffect(() => {
		const detectUserCountry = async () => {
			try {
				// Try to get country from IP using a free API
				const response = await fetch("https://ipapi.co/json/");
				const data = await response.json();

				if (data.country_code) {
					setDefaultCountry(data.country_code);
				}
			} catch {
				console.log("Could not detect country, using US as default");
			}
		};

		detectUserCountry();
	}, []);

	return (
		<motion.div
			className="w-full"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			{label && <label className="form-label">{label}</label>}
			<div className="relative">
				<PhoneNumberInput
					international
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					defaultCountry={defaultCountry as any}
					value={value}
					onChange={(value) => onChange(value || "")}
					placeholder={placeholder}
					className={cn(
						"input-field",
						className,
						error && "border-red-300 focus-within:border-red-500"
					)}
				/>
			</div>
			{error && (
				<motion.p
					className="mt-1 text-xs md:text-sm text-red-500"
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
				>
					{error}
				</motion.p>
			)}
		</motion.div>
	);
};

export default PhoneInputField;
