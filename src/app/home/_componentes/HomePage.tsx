'use client';

import { lazy, Suspense } from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';

// Lazy load sections para melhor performance
const SolutionsSection = lazy(() => import('./SolutionsSection').then(m => ({ default: m.SolutionsSection })));
const HowItWorksSection = lazy(() => import('./HowItWorksSection').then(m => ({ default: m.HowItWorksSection })));
const CTASection = lazy(() => import('./CTASection').then(m => ({ default: m.CTASection })));
const Footer = lazy(() => import('./Footer').then(m => ({ default: m.Footer })));

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <Suspense fallback={<div className="h-96 bg-background" />}>
        <SolutionsSection />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-background" />}>
        <HowItWorksSection />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-background" />}>
        <CTASection />
      </Suspense>
      <Suspense fallback={<div className="h-32 bg-background" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
