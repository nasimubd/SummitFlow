import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EventCard from "./EventCard";

const FeaturedEvents = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["featured_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const { data: regCounts } = useQuery({
    queryKey: ["featured_reg_counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("event_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((r) => {
        counts[r.event_id] = (counts[r.event_id] || 0) + 1;
      });
      return counts;
    },
  });

  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex items-end justify-between mb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
            Featured Events
          </h2>
          <p className="text-muted-foreground text-pretty">
            Hand-picked experiences powered by our AI discovery engine.
          </p>
        </motion.div>
        <Link
          to="/events"
          className="hidden md:flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
        >
          View all events <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="surface-card h-80 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              category={event.category}
              date={new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              location={event.location}
              attendees={String(regCounts?.[event.id] || 0)}
              imageUrl={event.cover_image_url ?? undefined}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          No events yet. Be the first to create one!
        </p>
      )}

      <Link
        to="/events"
        className="md:hidden flex items-center justify-center gap-2 mt-8 text-sm font-semibold text-primary"
      >
        View all events <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
};

export default FeaturedEvents;
