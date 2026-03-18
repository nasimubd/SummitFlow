import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import FeaturedEvents from "@/components/FeaturedEvents";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
    <Navbar />
    <main>
      <Hero />
      <StatsSection />
      <FeaturedEvents />
    </main>
    <Footer />
  </div>
);

export default Index;
