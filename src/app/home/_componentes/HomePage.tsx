'use client';

import { lazy, Suspense } from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';

// Lazy load sections para melhor performance
const SolutionsSection = lazy(() => import('./SolutionsSection').then(m => ({ default: m.SolutionsSection })));
const WhyGymBeeSection = lazy(() => import('./WhyGymBeeSection').then(m => ({ default: m.WhyGymBeeSection })));
const HowItWorksSection = lazy(() => import('./HowItWorksSection').then(m => ({ default: m.HowItWorksSection })));
const CTASection = lazy(() => import('./CTASection').then(m => ({ default: m.CTASection })));
const Footer = lazy(() => import('./Footer').then(m => ({ default: m.Footer })));

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
