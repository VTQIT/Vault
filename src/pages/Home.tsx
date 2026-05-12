import LightTendrils from "@/components/LightTendrils";
import Navigation from "@/components/Navigation";
import Hero from "@/sections/Hero";
import TrustedBy from "@/sections/TrustedBy";
import Features from "@/sections/Features";
import Demo from "@/sections/Demo";
import Pricing from "@/sections/Pricing";
import FAQ from "@/sections/FAQ";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <div className="relative">
      <LightTendrils />
      <Navigation />
      <Hero />
      <TrustedBy />
      <Features />
      <Demo />
      <Pricing />
      <FAQ />
      <Contact />
    </div>
  );
}
