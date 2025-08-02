import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Management Made Easy
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive tools designed specifically for property and restaurant management. 
            Everything you need in one powerful platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-science-blue to-endeavour min-h-[500px] lg:min-h-[300px]"
            className=""
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Seamless Reservation Management
              </h2>
              <p className="mt-4 text-left text-base/6 text-neutral-200">
                Manage table bookings and room reservations in real-time across all platforms with our advanced scheduling system.
              </p>
            </div>
            <img
              src="/card1.png"
              width={500}
              height={500}
              alt="Restaurant reservation system"
              className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
          
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-astronaut to-blue-zodiac">
            <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Complete Tenant Management
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Full lifecycle management with lease tracking and maintenance requests.
            </p>
          </WobbleCard>
          
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-br from-bunting to-midnight min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Comprehensive Analytics & Smart Billing
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                Deep insights into your business performance with automated billing, payment processing, and financial tracking.
              </p>
            </div>
            <img
              src="/card3.png"
              width={500}
              height={500}
              alt="Analytics dashboard"
              className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
        </div>
      </div>
    </section>
  );
}
