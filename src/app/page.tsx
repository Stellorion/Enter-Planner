'use client';

import FeatureSection from '../containers/Landing/FeatureSection';
import HeroSection from '../containers/Landing/HeroSection';
import OnboardSection from '../containers/Landing/OnboardSection';
import Scanner from '@/src/components/Scanner';
import { useThemeStore } from '../store/useThemeStore';

const LandingPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white dark:bg-[#020817]">
      <div className="absolute inset-0 -z-10">
        <Scanner
          color1={isDark ? '#020817' : '#FFFFFF'}
          color2={isDark ? '#1E293B' : '#020817'}
          color3={isDark ? '#3B82F6' : '#2563EB'}
          speed={1.2}
          sweepSpeed={0.6}
          sweepWidth={1}
          trail={0.5}
          ripple={0.7}
          bandDensity={25}
          glow={0.6}
          scanDirection="vertical"
          colorSpread={0.6}
          scanline
          scanlineIntensity={0.5}
          mouseInteraction={false}
          clickEffect="none"
          frequency={4}
          lineWidth={2}
          brightness={0.7}
          vignette={0.7}
          grainIntensity={0.05}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <HeroSection />
        <FeatureSection />
        <OnboardSection />
      </div>
    </main>
  );
};

export default LandingPage;
