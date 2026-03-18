import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
    <Navbar />
    <main>
      <Hero />
      <FeaturedEvents />
    </main>
    <Footer />
  </div>
);

export default Index;
