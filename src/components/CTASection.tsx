import React from "react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl lg:text-6xl font-bold text-white mb-6"
        >
          Ready to Transform Your Business?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-white/90 max-w-3xl mx-auto mb-12"
        >
          Join thousands of successful businesses that have revolutionized their operations. 
          Book your personalized demo today and see the difference in just 30 minutes.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button className="bg-white text-primary hover:bg-white/90 px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
            Book Your Free Demo
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:-translate-y-1">
            Call (555) 123-4567
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex items-center justify-center space-x-8 text-white/80"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>No setup fees</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}