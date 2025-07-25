/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import Button from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Validation schemas
const formSchema = z
	.object({
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(
				/[A-Z]/,
				"Password must contain at least one uppercase letter"
			)
			.regex(
				/[a-z]/,
				"Password must contain at least one lowercase letter"
			)
			.regex(/[0-9]/, "Password must contain at least one number")
			.regex(
				/[^A-Za-z0-9]/,
				"Password must contain at least one special character"
			)
			.refine((password) => password.length > 0, "Password is required"),
		confirm_password: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"], // Error will show on confirm_password field
	});

type FormData = z.infer<typeof formSchema>;

export default function ResetEmailPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			confirm_password: "",
		},
		mode: "onBlur", // Validate on blur for better UX
	});

	const { watch, trigger } = form;
	const watchedPassword = watch("password");

	const onSubmit = async (data: FormData) => {
		const isValid = await trigger(["password", "confirm_password"]);
		if (!isValid) return; // Prevent submission if validation fails

		setIsSubmitting(true);

		const { confirm_password, ...formValues } = data;
		const payload = { ...formValues };

		toast("Thank you");
		console.log("Form data before mutation:", payload);
		router.push(`/auth/login`);
	};

	// Display password requirements feedback
	const getPasswordRequirements = (password: string) => {
		const requirements = {
			minLength: password.length >= 8,
			hasUppercase: /[A-Z]/.test(password),
			hasLowercase: /[a-z]/.test(password),
			hasNumber: /[0-9]/.test(password),
			hasSpecial: /[^A-Za-z0-9]/.test(password),
		};

		const metCount = Object.values(requirements).filter(Boolean).length;
		const isValid = Object.values(requirements).every(Boolean);

		return { ...requirements, metCount, isValid };
	};

	const passwordReqs = getPasswordRequirements(watchedPassword || "");

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
							<motion.div
								key="step2"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
							>
								{/* Step 1: Admin Details */}
								<div className="mb-8">
									<h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
										Shhh... it&apos;s a secret.
									</h1>
									<p className="text-gray-600 text-base">
										Create your password to continue.
									</p>
								</div>

								<div className="space-y-6">
									{/* Password */}
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<div className="relative mb-2">
														<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
															<Lock size={20} />
														</div>
														<Input
															type={
																showPassword
																	? "text"
																	: "password"
															}
															placeholder="Create new password"
															className={`pl-12 pr-12 h-[50px] text-sm md:text-base bg-gray-50/50 border-2 rounded-xl ${
																form.formState
																	.errors
																	?.password
																	? "border-red-300 focus:border-red-500"
																	: "border-gray-200 focus:border-main-500 hover:border-gray-300"
															}`}
															{...field}
														/>
														<button
															type="button"
															onClick={() =>
																setShowPassword(
																	!showPassword
																)
															}
															className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
														>
															{showPassword ? (
																<EyeOff
																	size={20}
																/>
															) : (
																<Eye
																	size={20}
																/>
															)}
														</button>
													</div>
												</FormControl>
												<FormMessage />

												{/* Password Requirements */}
												{watchedPassword && (
													<motion.div
														initial={{
															opacity: 0,
															height: 0,
														}}
														animate={{
															opacity: 1,
															height: "auto",
														}}
														className="bg-gray-50 rounded-xl p-4"
													>
														<p className="text-sm font-medium text-gray-700 mb-3">
															Your password should
															have the following:
														</p>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
															<div
																className={`flex items-center ${
																	passwordReqs.minLength
																		? "text-green-600"
																		: "text-gray-500"
																}`}
															>
																<div
																	className={`w-2 h-2 rounded-full mr-2 ${
																		passwordReqs.minLength
																			? "bg-green-500"
																			: "bg-gray-300"
																	}`}
																/>
																minimum 8
																characters
															</div>
															<div
																className={`flex items-center ${
																	passwordReqs.hasUppercase
																		? "text-green-600"
																		: "text-gray-500"
																}`}
															>
																<div
																	className={`w-2 h-2 rounded-full mr-2 ${
																		passwordReqs.hasUppercase
																			? "bg-green-500"
																			: "bg-gray-300"
																	}`}
																/>
																one uppercase
																character
															</div>
															<div
																className={`flex items-center ${
																	passwordReqs.hasSpecial
																		? "text-green-600"
																		: "text-gray-500"
																}`}
															>
																<div
																	className={`w-2 h-2 rounded-full mr-2 ${
																		passwordReqs.hasSpecial
																			? "bg-green-500"
																			: "bg-gray-300"
																	}`}
																/>
																one special
																character
															</div>
															<div
																className={`flex items-center ${
																	passwordReqs.hasLowercase
																		? "text-green-600"
																		: "text-gray-500"
																}`}
															>
																<div
																	className={`w-2 h-2 rounded-full mr-2 ${
																		passwordReqs.hasLowercase
																			? "bg-green-500"
																			: "bg-gray-300"
																	}`}
																/>
																one lowercase
																character
															</div>
															<div
																className={`flex items-center ${
																	passwordReqs.hasNumber
																		? "text-green-600"
																		: "text-gray-500"
																}`}
															>
																<div
																	className={`w-2 h-2 rounded-full mr-2 ${
																		passwordReqs.hasNumber
																			? "bg-green-500"
																			: "bg-gray-300"
																	}`}
																/>
																one number
															</div>
														</div>
													</motion.div>
												)}
											</FormItem>
										)}
									/>

									{/* Confirm Password */}
									<FormField
										control={form.control}
										name="confirm_password"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<div className="relative mb-2">
														<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
															<Lock size={20} />
														</div>
														<Input
															type={
																showPassword
																	? "text"
																	: "password"
															}
															placeholder="Confirm new password"
															className={`pl-12 pr-12 h-[50px] text-sm md:text-base bg-gray-50/50 border-2 rounded-xl ${
																form.formState
																	.errors
																	?.confirm_password
																	? "border-red-300 focus:border-red-500"
																	: "border-gray-200 focus:border-main-500 hover:border-gray-300"
															}`}
															{...field}
														/>
														<button
															type="button"
															onClick={() =>
																setShowPassword(
																	!showPassword
																)
															}
															className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
														>
															{showPassword ? (
																<EyeOff
																	size={20}
																/>
															) : (
																<Eye
																	size={20}
																/>
															)}
														</button>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Action Buttons */}
									<div className="pt-4">
										<Button
											type="submit"
											disabled={isSubmitting}
											className="w-full h-[50px] text-base font-semibold"
										>
											{isSubmitting ? (
												<Loader />
											) : (
												"Reset Password"
											)}
										</Button>
									</div>
								</div>
							</motion.div>
						</motion.div>
					</form>
				</Form>
			</motion.div>
		</div>
	);
}
