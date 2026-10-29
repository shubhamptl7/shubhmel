import { MotionConfig } from "motion/react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Problem } from "./components/Problem";
import { HowItWorks } from "./components/HowItWorks";
import { Attention } from "./components/Attention";
import { Audience } from "./components/Audience";
import { BuildStatus } from "./components/BuildStatus";
import { EarlyAccess } from "./components/EarlyAccess";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    // reducedMotion="user": with the OS "reduce motion" setting on, Motion
    // drops transform/layout animation (WCAG 2.3.3) and keeps only fades.
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Attention />
        <Audience />
        <BuildStatus />
        <EarlyAccess />
        <Faq />
      </main>
      <Footer />
    </MotionConfig>
  );
}
