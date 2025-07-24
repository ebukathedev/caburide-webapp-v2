import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "outline" | "text";
	size?: "sm" | "md" | "lg";
	icon?: React.ReactNode;
	iconPosition?: "left" | "right";
	fullWidth?: boolean;
	className?: string;
	onClick?: () => void;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
	children,
	variant = "primary",
	size = "md",
	icon,
	iconPosition = "right",
	fullWidth = false,
	className = "",
	onClick,
	disabled = false,
	type = "button",
}) => {
	const baseClasses =
		"font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variantClasses = {
		primary:
			"bg-linear-to-r/oklch from-primary-600 to-primary-500 text-white shadow-button hover:shadow-card-hover focus:ring-primary-500",
		secondary:
			"bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-gray-300",
		outline:
			"bg-transparent border border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
		text: "bg-transparent text-primary-600 hover:text-primary-700 focus:ring-primary-500 shadow-none",
	};

	const sizeClasses = {
		sm: "px-4 py-2 text-sm",
		md: "px-6 py-3",
		lg: "px-8 py-4 text-lg",
	};

	const widthClass = fullWidth ? "w-full" : "";
	const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";

	return (
		<motion.button
			type={type}
			className={`inline-flex items-center justify-center ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
			onClick={onClick}
			disabled={disabled}
			whileTap={{ scale: disabled ? 1 : 0.98 }}
			whileHover={{ scale: disabled ? 1 : 1.02 }}
		>
			{icon && iconPosition === "left" && (
				<span className="mr-2">{icon}</span>
			)}
			{children}
			{icon && iconPosition === "right" && (
				<span className="ml-2">{icon}</span>
			)}
		</motion.button>
	);
};

export default Button;
