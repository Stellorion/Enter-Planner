
import LandingBg from '../components/LandingBg';
import FeatureSection from '../containers/Landing/FeatureSection';
import HeroSection from '../containers/Landing/HeroSection';
import OnboardSection from '../containers/Landing/OnboardSection';

const LandingPage = () => {

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white dark:bg-[#020817]">
      <LandingBg />

      <div className="relative z-10 flex flex-col items-center px-4">
        <HeroSection />
        <FeatureSection />
        <OnboardSection />
      </div>
    </main>
  );
};

export default LandingPage;