import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const ease = [0.4, 0, 0.2, 1];

const Hero = () => (
  <section className="relative pt-24 pb-20 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-6 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]">
          <Sparkles className="w-3 h-3" /> AI-Powered Orchestration
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-6 text-balance leading-[1.1]">
          Manage Events{" "}
          <span className="text-primary">Smarter</span> with AI
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 text-pretty leading-relaxed">
          From intelligent scheduling to automated attendee engagement. The
          all-in-one platform for modern event organizers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/events"
            className="h-12 px-8 btn-primary rounded-xl flex items-center gap-2 group transition-all duration-200 hover:brightness-110 active:scale-95"
          >
            Browse Events
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            to="/dashboard"
            className="h-12 px-8 btn-secondary rounded-xl flex items-center transition-all duration-200 hover:bg-secondary/80 active:scale-95"
          >
            Create Event
          </Link>
        </div>
      </motion.div>
    </div>

    {/* Subtle glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
  </section>
);

export default Hero;
