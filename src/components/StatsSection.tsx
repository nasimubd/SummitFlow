import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarDays, Users, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const StatCard = ({
  icon: Icon,
  value,
  label,
  delay,
}: {
  icon: typeof CalendarDays;
  value: number | string;
  label: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    className="surface-card p-6 flex flex-col items-center text-center"
  >
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <span className="text-3xl font-bold text-foreground tabular-nums">{value}</span>
    <span className="text-sm text-muted-foreground mt-1">{label}</span>
  </motion.div>
);

const StatsSection = () => {
  const { data: eventCount } = useQuery({
    queryKey: ["stats_events"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const { data: attendeeCount } = useQuery({
    queryKey: ["stats_attendees"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const { data: organiserCount } = useQuery({
    queryKey: ["stats_organisers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("organiser_name");
      if (error) throw error;
      const unique = new Set(data.map((e) => e.organiser_name));
      return unique.size;
    },
  });

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard icon={CalendarDays} value={eventCount ?? "—"} label="Events Hosted" delay={0} />
        <StatCard icon={Users} value={attendeeCount ?? "—"} label="Attendees Registered" delay={0.1} />
        <StatCard icon={UserCheck} value={organiserCount ?? "—"} label="Organisers" delay={0.2} />
      </div>
    </section>
  );
};

export default StatsSection;
