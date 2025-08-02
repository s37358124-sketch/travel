import React from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function BenefitsSection() {
  const benefits = [
    {
      title: "Increase Profits by 30%",
      description: "Optimize pricing strategies, reduce operational costs, and maximize revenue through intelligent automation and data-driven insights.",
    },
    {
      title: "Save 15+ Hours Weekly",
      description: "Automate repetitive tasks and streamline operations to focus on what matters most - your guests and growth.",
    },
    {
      title: "Enhanced Security",
      description: "Enterprise-grade security with data encryption, secure payment processing, and compliance management.",
    },
    {
      title: "Improved Guest Experience",
      description: "Deliver exceptional service with seamless check-ins, personalized experiences, and instant communication channels.",
    },
    {
      title: "Real-time Analytics",
      description: "Get instant insights into your business performance with comprehensive dashboards and detailed reporting.",
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support to ensure your business runs smoothly without any interruptions.",
    },
    {
      title: "Automated Billing",
      description: "Streamline payment processing with automated invoicing, payment tracking, and financial reporting.",
    },
    {
      title: "Multi-location Management",
      description: "Manage multiple properties and restaurants from a single dashboard with centralized control.",
    },
  ];

  return (
    <section id="benefits" className="relative z-20 py-20 max-w-7xl mx-auto">
      <div className="px-8">
        <h2 className="text-2xl lg:text-4xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-gray-900 dark:text-white">
          Transform Your Business Today
        </h2>
        <p className="text-base max-w-2xl my-6 mx-auto text-gray-600 dark:text-gray-300 text-center font-normal">
          Join thousands of successful property and restaurant owners who have revolutionized their operations 
          with our comprehensive management platform.
        </p>
      </div>

      <div className="relative px-8">
        <HoverEffect items={benefits} />
      </div>
    </section>
  );
}
