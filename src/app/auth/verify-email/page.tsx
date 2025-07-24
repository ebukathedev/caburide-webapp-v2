"use client";
import OtpInput from "@/components/auth/OtpInput";
import { Form } from "@/components/ui/form";
import Button from "@/components/ui/icon-button";
import Loader from "@/components/ui/loader";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function VerifyEmail() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [token, setOtp] = useState("");
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [timeLeft, setTimeLeft] = useState(60);
	const [isResending, setIsResending] = useState(false);

	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setTimeout(() => {
				setTimeLeft(timeLeft - 1);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [timeLeft]);

	const form = useForm({
		defaultValues: {
			otp: "",
		},
	});

	const handleResend = () => {
		if (timeLeft !== 0 || isResending) return;
		setIsResending(true);
	};

	const onChange = (value: string) => {
		setOtp(value);
		form.setValue("otp", value);
		setIsButtonDisabled(value.length !== 4);
	};

	const onSubmit = async () => {
		setIsSubmitting(true);
		console.log("Form values before mutation:", form.getValues());
		console.log({
			...form.getValues(),
			otp: token,
		});
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	return (
		<div className="relative z-10 flex-grow flex flex-col justify-center items-center lg:!scale-[0.9]">
			<motion.div
				className="w-full max-w-lg"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						{/* Form Card */}
						<motion.div
							className="bg-white/80 backdrop-blur-xl rounded-3xl sm:shadow-xl border border-white/20 p-4 py-8 lg:p-8"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.5 }}
						>
							<AnimatePresence mode="wait">
								<motion.div
									key="step1"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									transition={{ duration: 0.3 }}
								>
									{/* Step 1: Admin Details */}
									<div className="mb-8">
										<h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
											You Know the Drill, Sign In.
										</h1>
										<p className="text-gray-600 text-base">
											Just drop your details below to sign
											in.
										</p>
									</div>
									<div className="flex flex-col items-center w-full mt-5">
										<OtpInput
											valueLength={4}
											setValue={setOtp}
											value={token}
											onChange={onChange}
										/>
										<div className="w-full mt-6 text-center">
											<p className="text-sm text-gray-600">
												Resend code in{" "}
												<span className="font-medium">
													{formatTime(timeLeft)}
												</span>
											</p>

											<button
												className={`mt-2 text-sm font-medium ${
													timeLeft === 0
														? "text-primary hover:text-primary"
														: "text-gray-400 cursor-not-allowed"
												}`}
												onClick={handleResend}
												disabled={
													timeLeft > 0 || isResending
												}
											>
												{isResending
													? "Resending..."
													: "Resend code"}
											</button>
										</div>
									</div>
									<motion.div
										whileTap={{
											scale: isSubmitting ? 1 : 0.98,
										}}
										whileHover={{
											scale: isSubmitting ? 1 : 1.02,
										}}
										className="w-full mt-8"
									>
										<Button
											className="w-full h-[50px] text-base font-semibold"
											type="submit"
											disabled={
												isButtonDisabled || isSubmitting
											}
										>
											{isSubmitting ? (
												<Loader />
											) : (
												"Verify OTP"
											)}
										</Button>
									</motion.div>
								</motion.div>
							</AnimatePresence>
						</motion.div>
					</form>
				</Form>
			</motion.div>
		</div>
	);
}
