import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

interface LoaderProps {
	size?: number;
	className?: string;
}

export default function Loader({ size = 20, className }: LoaderProps) {
	return (
		<motion.div
			className={cn(
				"border-2 border-white border-t-transparent rounded-full",
				className
			)}
			style={{ width: size, height: size }}
			animate={{
				rotate: 360,
			}}
			transition={{
				duration: 1,
				repeat: Infinity,
				ease: "linear",
			}}
		/>
	);
}
