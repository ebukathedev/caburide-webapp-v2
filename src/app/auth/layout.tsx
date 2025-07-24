import Image from "next/image";
import React, { ReactNode } from "react";
import authBg from "@/assets/images/auth-bg.png";
import authImg from "@/assets/images/auth-img.svg";
import logo from "@/assets/images/logo.svg";
import line from "@/assets/svgs/line.svg";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<main className="bg-background min-h-screen mx-auto max-w-screen-2xl">
			<div className="grid flex-grow grid-cols-1 lg:grid-cols-2 min-h-screen">
				<div className="min-h-full relative hidden lg:flex items-center">
					<div className="relative z-10 mt-[54px]">
						<div className="w-[80%] mx-auto">
							<div className="flex items-center gap-2 mb-[54px]">
								<Image
									src={logo}
									alt="logo"
									width={30}
									height={30}
								/>
								<span className="font-bold text-2xl text-[#0D062D]">
									Caburide
								</span>
							</div>
							<p className="font-light text-lg">
								We Power the Journey
								<Image
									src={line}
									alt="line"
									width={30}
									height={30}
								/>
							</p>
							<h1 className="text-5xl font-bold mt-3">
								You Run <br />
								the <span className="text-primary">Route</span>
							</h1>
						</div>

						<div className="xl:w-[90%] -translate-y-[4rem] xl:-translate-y-[5rem]">
							<Image
								src={authImg}
								alt="A hand hoding a dashboard card"
							/>
						</div>
					</div>
					{/* background */}``
					<div className="absolute inset-0 -top-[10rem] flex items-center overflow-hidden">
						<Image
							src={authBg}
							alt="illustration"
							width={500}
							height={500}
							className="min-w-full scale-[1.5] xl:scale-none"
						/>
					</div>
				</div>
				<div className="min-h-full lg:shadow-[-14px_37px_86px] lg:shadow-[#78748636] flex flex-col justify-center">
					{children}
				</div>
			</div>
		</main>
	);
}
