'use client';

import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { ProblemsSection } from './ProblemsSection';
import { FeaturesSection } from './FeaturesSection';
import { WhyGymBeeSection } from './WhyGymBeeSection';
import { HowItWorksSection } from './HowItWorksSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProblemsSection />
      <FeaturesSection />
      <WhyGymBeeSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
