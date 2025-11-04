import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import FormationsSection from '@/components/home/FormationsSection';
import ContactSection from '@/components/home/ContactSection';
import ScrollIndicator from '@/components/home/ScrollIndicator';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FormationsSection />
      <ContactSection />
      <ScrollIndicator />
    </>
  );
}