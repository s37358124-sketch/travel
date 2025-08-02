import NavigationBar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import ReviewsSection from "@/components/ReviewsSection";
import QASection from "@/components/QASection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <ReviewsSection />
      <QASection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
