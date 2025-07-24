import React from "react";
import { motion } from "motion/react";

interface SocialSignInButtonProps {
	icon: React.ReactNode;
	provider: string;
	onClick?: () => void;
}

const SocialSignInButton: React.FC<SocialSignInButtonProps> = ({
	icon,
	provider,
	onClick,
}) => {
	const getBgColor = () => {
		switch (provider.toLowerCase()) {
			case "apple":
				return "bg-black text-white hover:bg-gray-900";
			case "google":
				return "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50";
			case "email":
				return "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50";
			case "phone":
				return "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50";
			default:
				return "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50";
		}
	};

	return (
		<motion.button
			className={`flex items-center justify-center w-full py-3 px-4 rounded-xl font-medium transition-all ${getBgColor()}`}
			onClick={onClick}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			<span className="mr-3">{icon}</span>
			<span>Continue with {provider}</span>
		</motion.button>
	);
};

export default SocialSignInButton;
