"use client";

import { motion } from "framer-motion";
import { FlipWords } from "@/components/ui/flip-words";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-property-restaurant.jpg";

export default function HeroSection() {
  const words = ["efficient", "profitable", "streamlined", "intelligent"];

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-black pt-20">
      {/* Grid Background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      
      <div className="relative z-20 mx-auto flex max-w-7xl flex-col items-center justify-center">
        <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-5xl text-center text-3xl font-bold text-foreground md:text-5xl lg:text-7xl">
          {"Make your property and restaurant management"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
          <br />
          <FlipWords words={words} className="text-3xl md:text-5xl lg:text-7xl" />
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-2xl py-6 text-center text-lg font-normal text-muted-foreground"
        >
          Transform your hospitality business with our comprehensive property and restaurant management system. 
          Streamline operations, boost profits, and deliver exceptional experiences effortlessly.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button className="hero-button w-60 transform rounded-lg px-8 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5">
            Book a Demo
          </button>
          <button className="hero-button-secondary w-60 transform rounded-lg px-8 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5">
            Contact Support
          </button>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-3xl border border-border feature-card p-6 shadow-card-custom"
        >
          <div className="w-full overflow-hidden rounded-xl border border-border">
            <video
              src="https://res.cloudinary.com/duhughmsv/video/upload/v1754072589/Product_Demo_Video___SaaS_Explainer_Video___Infinity_cdrpgb.mp4"
              className="aspect-[16/9] h-auto w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </motion.div>
      </div>
    </div>
  </div>
  );
}