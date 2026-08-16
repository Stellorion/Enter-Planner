import FeatureSection from '../containers/Landing/FeatureSection';
import HeroSection from '../containers/Landing/HeroSection';
import OnboardSection from '../containers/Landing/OnboardSection';
import ForceField from '../components/canvasui/ForceField';

const LandingPage = () => {
  return (
    <ForceField
      cellScale={35}
      // Light mode
      lightColor={[0.05, 0.3, 0.85]}
      lightEdgeColor={[0.1, 0.4, 1.0]}
      // Dark mode
      darkColor={[0.15, 0.68, 1.0]}
      darkEdgeColor={[0.5, 0.8, 1.0]}
      opacity={1}
      gridOpacity={0.3}
      edgeGlow={0.35}
      hoverGlow={0.4}
      bloom={1.2}
    >
      <main className="flex flex-1 flex-col items-center justify-center bg-white px-6 dark:bg-gray-900">
        <HeroSection />
        <FeatureSection />
        <OnboardSection />
      </main>
    </ForceField>
  );
};

export default LandingPage;
