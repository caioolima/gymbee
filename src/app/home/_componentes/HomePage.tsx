'use client';

import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { SolutionsSection } from './SolutionsSection';
import { WhyGymBeeSection } from './WhyGymBeeSection';
import { HowItWorksSection } from './HowItWorksSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SolutionsSection />
      <WhyGymBeeSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
