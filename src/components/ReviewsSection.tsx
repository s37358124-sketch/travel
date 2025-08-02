"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          What Our Clients Say
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Join thousands of satisfied property owners and restaurant managers who have transformed 
          their businesses with our platform.
        </p>
      </div>
      <div className="rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote:
      "This system revolutionized our restaurant operations. We've seen a 40% increase in efficiency and our customer satisfaction scores have never been higher. The reservation management is particularly outstanding.",
    name: "Sarah Chen",
    title: "Owner, Golden Dragon Restaurant",
    rating: 5,
  },
  {
    quote:
      "Managing our apartment complex became effortless after implementing this platform. Tenant communication, maintenance requests, and billing are now completely automated. It's saved us countless hours every week.",
    name: "Michael Rodriguez",
    title: "Property Manager, Sunset Apartments",
    rating: 5,
  },
  {
    quote:
      "The analytics and reporting features gave us insights we never had before. We optimized our pricing strategy and increased our revenue by 25% in just six months. Absolutely game-changing for our hotel business.",
    name: "Emily Thompson",
    title: "General Manager, Riverside Inn",
    rating: 5,
  },
  {
    quote:
      "As someone managing both properties and a restaurant, having everything in one platform is incredible. The integration between modules is seamless, and the support team is phenomenal. Highly recommended!",
    name: "David Kim",
    title: "Owner, Kim's Hospitality Group",
    rating: 5,
  },
  {
    quote:
      "The automated billing system alone has paid for itself. No more manual calculations or payment tracking headaches. Our tenants love the online portal, and we love the reduced administrative work.",
    name: "Lisa Martinez",
    title: "Property Owner, Martinez Properties",
    rating: 5,
  },
  {
    quote:
      "We went from chaos to complete organization in just a few weeks. The system is intuitive, powerful, and has made our daily operations so much smoother. Our staff productivity has increased dramatically.",
    name: "James Wilson",
    title: "Operations Director, Coastal Resorts",
    rating: 5,
  },
];