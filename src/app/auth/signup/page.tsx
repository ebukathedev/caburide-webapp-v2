"use client";
import GoogleLogo from "@/assets/icons/google-logo.png";
import SocialSignInButton from "@/components/auth/SocialSignInButton";
import PhoneInputField from "@/components/PhoneInputField";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ICountry } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";

import { Building2, Eye, EyeOff, Globe, Lock, Mail, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

// Validation schemas
const adminSchema = z
	.object({
		first_name: z.string().min(1, "First name is required").trim(),
		last_name: z.string().min(1, "Last name is required").trim(),
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.refine((password) => password.length > 0, "Password is required"),
		confirm_password: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"], // Error will show on confirm_password field
	});

const organizationSchema = z.object({
	name: z.string().min(1, "Organization name is required").trim(),
	contact_email: z
		.string()
		.min(1, "Contact email is required")
		.email("Please enter a valid email address"),
	phone: z
		.string()
		.min(1, "Phone number is required")
		.min(10, "Phone number must be at least 10 characters")
		.refine((phone) => {
			// Remove all non-digit characters to check actual length
			const digitsOnly = phone.replace(/\D/g, "");
			return digitsOnly.length >= 10; // At least 10 digits
		}, "Please enter a valid phone number"),
	country: z.string().min(1, "Please select a country"),
});

const fullSchema = z.object({
	admin: adminSchema,
	organization: organizationSchema,
});

type FormData = z.infer<typeof fullSchema>;

const SignupPage: React.FC = () => {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [countries, setCountries] = useState<ICountry[]>([]);

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				const response = await fetch(
					"https://staging-api.caburide.com/v1/public/countries"
				);
				if (!response.ok) throw new Error("Failed to fetch countries");
				const { data } = await response.json();

				// deduplicate the array to avoid duplicate keys error
				const uniqueCountries = data.filter(
					(country: ICountry, index: number, self: ICountry[]) =>
						index === self.findIndex((c) => c.iso === country.iso)
				);
				setCountries(uniqueCountries);
			} catch (error) {
				setCountries([]);
			}
		};
		fetchCountries();
	}, []);

	const form = useForm<FormData>({
		resolver: zodResolver(fullSchema),
		defaultValues: {
			admin: {
				first_name: "",
				last_name: "",

				confirm_password: "",
			},
			organization: {
				name: "",
				contact_email: "",
				phone: "",
				country: "",
			},
		},
		mode: "onBlur", // Validate on blur for better UX
	});

	const { watch, trigger } = form;
	const watchedPassword = watch("admin.password");

	const validateCurrentStep = async (step: number): Promise<boolean> => {
		if (step === 1) {
			return await trigger([
				"admin.first_name",
				"admin.last_name",
				"admin.email",
			]);
		} else if (step === 2) {
			return await trigger(["admin.password", "admin.confirm_password"]);
		} else if (step === 3) {
			return await trigger([
				"organization.name",
				"organization.contact_email",
				"organization.phone",
				"organization.country",
			]);
		}
		return true;
	};

	const handleNext = async () => {
		const isValid = await validateCurrentStep(currentStep);
		if (isValid) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		setCurrentStep((prev) => prev - 1);
	};

	const onSubmit = async (data: FormData) => {
		const isValid = await validateCurrentStep(3);
		if (!isValid) return;

		setIsSubmitting(true);
		// Remove confirm_password before sending
		const { confirm_password, ...adminDetails } = data.admin;
		const payload = {
			...data,
			admin: adminDetails,
		};
		toast("Thank you");
		console.log("Form data before mutation:", payload);
		// router.push(
		// 	`/auth/verify-email?email=${encodeURIComponent(data.admin.email)}`
		// );
	};

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
							<AnimatePresence mode="wait">
								{currentStep === 1 ? (
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
												We&apos;ve Been Waiting for You.
											</h1>
											<p className="text-gray-600 text-base">
												Just drop your details below and
												let&apos;s get started.
											</p>
										</div>

										<div className="space-y-6">
											{/* First Name */}
											<FormField
												control={form.control}
												name="admin.first_name"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className="relative">
																<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
																	<User
																		size={
																			20
																		}
																	/>
																</div>
																<Input
																	placeholder="First name"
																	className={`pl-12 h-[50px] text-sm md:text-base bg-gray-50/50 border-2 rounded-xl ${
																		form
																			.formState
																			.errors
																			.admin
																			?.first_name
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

											{/* Last Name */}
											<FormField
												control={form.control}
												name="admin.last_name"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className="relative">
																<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
																	<User
																		size={
																			20
																		}
																	/>
																</div>
																<Input
																	placeholder="Last name"
																	className={`pl-12 h-[50px] text-sm md:text-base bg-gray-50/50 border-2 rounded-xl ${
																		form
																			.formState
																			.errors
																			.admin
																			?.last_name
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

											{/* Email */}
											<FormField
												control={form.control}
												name="admin.email"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className="relative">
																<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
																	<Mail
																		size={
																			20
																		}
																	/>
																</div>
																<Input
																	type="email"
																	placeholder="Email Address"
																	className={`pl-12 h-[50px] text-sm md:text-base bg-gray-50/50 border-2 rounded-xl ${
																		form
																			.formState
																			.errors
																			.admin
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
												<div className="pt-4">
													<Button
														type="button"
														fullWidth
														onClick={handleNext}
														className="w-full h-[50px] text-base font-semibold"
													>
														Continue
													</Button>
												</div>

												{/* Divider */}
												<div className="flex items-center">
													<div className="flex-1 h-px bg-gray-200"></div>
													<span className="px-3 text-sm font-medium text-gray-500">
														OR
													</span>
													<div className="flex-1 h-px bg-gray-200"></div>
												</div>

												<SocialSignInButton
													provider="Google"
													icon={
														<Image
															src={GoogleLogo}
															alt="google logo"
															className="-mt-1"
															width={20}
															height={20}
														/>
													}
												/>
											</div>
										</div>
									</motion.div>
								) : currentStep === 2 ? (
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
												Create your password to
												continue.
											</p>
										</div>

										<div className="space-y-6">
											{/* Password */}
											<FormField
												control={form.control}
												name="admin.password"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className="relative mb-2">
																<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
																	<Lock
																		size={
																			20
																		}
																	/>
																</div>
																<Input
																	type={
																		showPassword
																			? "text"
																			: "password"
																	}
																	placeholder="Create password"
																	className={`pl-12 pr-12 h-[50px] text-sm md:text-base bg-gray-50/50 border-2 rounded-xl ${
																		form
																			.formState
																			.errors
																			.admin
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
																			size={
																				20
																			}
																		/>
																	) : (
																		<Eye
																			size={
																				20
																			}
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
																	Your
																	password
																	should have
																	the
																	following:
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
																		minimum
																		8
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
																		one
																		uppercase
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
																		one
																		special
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
																		one
																		lowercase
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
																		one
																		number
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
												name="admin.confirm_password"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className="relative mb-2">
																<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
																	<Lock
																		size={
																			20
																		}
																	/>
																</div>
																<Input
																	type={
																		showPassword
																			? "text"
																			: "password"
																	}
																	placeholder="Confirm password"
																	className={`pl-12 pr-12 h-[50px] text-sm md:text-base bg-gray-50/50 border-2 rounded-xl ${
																		form
																			.formState
																			.errors
																			.admin
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
																			size={
																				20
																			}
																		/>
																	) : (
																		<Eye
																			size={
																				20
																			}
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
											<div className="flex flex-col gap-4 pt-4">
												<Button
													type="button"
													variant="secondary"
													onClick={handleBack}
													className="w-full h-[50px] text-base font-semibold"
												>
													Back
												</Button>

												{/* Next Button */}
												<Button
													type="button"
													fullWidth
													onClick={handleNext}
													className="w-full h-[50px] text-base font-semibold"
												>
													Continue
												</Button>
											</div>
										</div>
									</motion.div>
								) : (
									<motion.div
										key="step3"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.3 }}
									>
										{/* Step 2: Organization Details */}
										<div className="mb-8">
											<h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
												One click from done!
											</h1>
											<p className="text-gray-600 text-base">
												Tell us about your organization
											</p>
										</div>

										<div className="space-y-6">
											{/* Organization Name */}
											<FormField
												control={form.control}
												name="organization.name"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className="relative">
																<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
																	<Building2
																		size={
																			20
																		}
																	/>
																</div>
																<Input
																	placeholder="Organization name"
																	className={`pl-12 h-[50px] text-sm md:text-base bg-gray-50/50 border-2 rounded-xl ${
																		form
																			.formState
																			.errors
																			.organization
																			?.name
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

											{/* Contact Email */}
											<FormField
												control={form.control}
												name="organization.contact_email"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className="relative">
																<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
																	<Mail
																		size={
																			20
																		}
																	/>
																</div>
																<Input
																	type="email"
																	placeholder="Contact email"
																	className={`pl-12 h-[50px] text-sm md:text-base bg-gray-50/50 border-2 rounded-xl ${
																		form
																			.formState
																			.errors
																			.organization
																			?.contact_email
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

											{/* Phone Number */}
											<FormField
												control={form.control}
												name="organization.phone"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<PhoneInputField
																value={
																	field.value
																}
																onChange={
																	field.onChange
																}
																className={`h-[50px] text-sm md:text-base bg-gray-50/50 text-gray-900 [&>input]:bg-gray-50/50 mb-2 ${
																	form
																		.formState
																		.errors
																		.organization
																		?.phone
																		? "border-red-300 focus:border-red-500"
																		: "!border-gray-200 focus:border-primary-500 hover:border-gray-300"
																}`}
																placeholder="Organization phone number"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											{/* Country */}
											<FormField
												control={form.control}
												name="organization.country"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className="relative">
																<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
																	<Globe
																		size={
																			20
																		}
																	/>
																</div>
																<Select
																	onValueChange={
																		field.onChange
																	}
																	value={
																		field.value
																	}
																>
																	<SelectTrigger
																		className={`pl-12 !h-[50px] text-sm md:text-base bg-gray-50/50 border-2 rounded-xl w-full ${
																			form
																				.formState
																				.errors
																				.organization
																				?.country
																				? "border-red-300 focus:border-red-500"
																				: "border-gray-200 focus:border-primary-500 hover:border-gray-300"
																		}`}
																	>
																		<SelectValue placeholder="Select country" />
																	</SelectTrigger>
																	<SelectContent>
																		{countries.map(
																			(
																				country
																			) => (
																				<SelectItem
																					key={
																						country.iso
																					}
																					value={
																						country.iso
																					}
																				>
																					{
																						country.nicename
																					}
																				</SelectItem>
																			)
																		)}
																	</SelectContent>
																</Select>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<div className="flex flex-col gap-4 pt-4">
												<Button
													type="button"
													variant="secondary"
													onClick={handleBack}
													className="w-full h-[50px] text-base font-semibold"
												>
													Back
												</Button>
												<Button
													type="submit"
													disabled={isSubmitting}
													className="w-full h-[50px] text-base font-semibold"
												>
													{isSubmitting ? (
														<Loader />
													) : (
														"Sign Up"
													)}
												</Button>
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</form>
				</Form>

				{/* Terms and Privacy */}
				<motion.div
					className="text-center mt-6 text-sm text-gray-500"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8 }}
				>
					<p>
						Already have an account?{" "}
						<Link
							href={"/auth/login"}
							className="text-primary-600 hover:text-primary-700 hover:underline"
						>
							Sign in
						</Link>
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default SignupPage;
