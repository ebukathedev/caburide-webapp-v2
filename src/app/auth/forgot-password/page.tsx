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
import { Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
		mode: "onBlur", // Validate on blur for better UX
	});
	const { trigger } = form;

	const onSubmit = async (data: FormData) => {
		const isValid = await trigger(["email"]);
		if (!isValid) return;

		setIsSubmitting(true);
		console.log("Form data before mutation:", data);

		router.push("/auth/forgot-password/verify-email");
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
											Misplaced it? We&apos;ve got you.
										</h1>
										<p className="text-gray-600 text-base">
											Enter your email, and we’ll send you
											a reset link.
										</p>
									</div>

									<div className="space-y-6">
										{/* Email */}
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<div className="relative">
															<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
																<Mail
																	size={20}
																/>
															</div>
															<Input
																type="email"
																placeholder="Email Address"
																className={`pl-12 h-[50px] text-sm md:text-base bg-gray-50/50 border-2 rounded-xl ${
																	form
																		.formState
																		.errors
																		?.email
																		? "border-red-300 focus:border-red-500"
																		: "border-gray-200 focus:border-primary-500 hover:border-gray-300"
																}`}
																{...field}
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Action Buttons */}
										<div className="flex flex-col gap-4 pt-4">
											{/* Next Button */}
											<Button
												type="submit"
												disabled={isSubmitting}
												className="w-full h-[50px] text-base font-semibold"
											>
												{isSubmitting ? (
													<Loader />
												) : (
													"Continue"
												)}
											</Button>
										</div>
									</div>
								</motion.div>
							</AnimatePresence>
						</motion.div>
					</form>
				</Form>

				{/* Terms and Privacy */}
				<motion.div
					className="text-center mt-6 text-sm text-gray-500 font-medium"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8 }}
				>
					<p>
						Don&apos; have an account?{" "}
						<Link
							href={"/auth/signup"}
							className="text-primary-600 hover:text-primary-700 hover:underline"
						>
							Sign up
						</Link>
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
}
