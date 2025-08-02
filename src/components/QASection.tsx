import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function QASection() {
  const faqs = [
    {
      question: "How quickly can we get started with the system?",
      answer: "Implementation typically takes 1-2 weeks depending on your business size. Our dedicated onboarding team will guide you through the entire setup process, including data migration, staff training, and system customization."
    },
    {
      question: "What's included in the demo?",
      answer: "Our comprehensive demo includes a walkthrough of all features relevant to your business type, a customized setup based on your needs, Q&A session with our experts, and a 14-day free trial to test the system with your actual data."
    },
    {
      question: "How does the pricing work?",
      answer: "We offer flexible pricing plans based on your business size and needs. Pricing starts at $99/month for small properties and includes all core features. Enterprise plans include additional customization and priority support. Contact us for a personalized quote."
    },
    {
      question: "Can the system handle multiple properties and restaurants?",
      answer: "Absolutely! Our platform is designed to scale with your business. You can manage unlimited properties and restaurants from a single dashboard, with centralized reporting and individual location management capabilities."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide 24/7 customer support via phone, email, and live chat. All plans include free training, regular system updates, and access to our comprehensive knowledge base. Enterprise customers get dedicated account managers."
    },
    {
      question: "Is my data secure?",
      answer: "Security is our top priority. We use bank-level encryption, regular security audits, and comply with industry standards including PCI DSS for payment processing. Your data is backed up daily and stored in secure, redundant servers."
    },
    {
      question: "Can I integrate with my existing tools?",
      answer: "Yes! Our system integrates with popular tools including QuickBooks, Stripe, Square, various POS systems, and property management platforms. We also offer API access for custom integrations."
    },
    {
      question: "Do you offer training for my staff?",
      answer: "Comprehensive training is included with all plans. We provide live training sessions, video tutorials, user manuals, and ongoing support to ensure your team is comfortable with the system."
    }
  ];

  return (
    <section id="qa" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, 
            our support team is ready to help.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`} 
              className="feature-card border border-border rounded-lg px-6 py-2"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-primary dark:hover:text-primary-glow font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-2 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Still have questions? We're here to help!
          </p>
          <button className="hero-button px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5">
            Contact Our Support Team
          </button>
        </div>
      </div>
    </section>
  );
}