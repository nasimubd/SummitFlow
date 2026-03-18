import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import EventCard from "./EventCard";
import conferenceImg from "@/assets/event-conference.jpg";
import workshopImg from "@/assets/event-workshop.jpg";
import networkingImg from "@/assets/event-networking.jpg";

const events = [
  {
    id: "1",
    title: "Global AI Summit 2026",
    category: "Conference",
    date: "Oct 24, 2026",
    location: "San Francisco, CA",
    attendees: "1,240",
    imageUrl: conferenceImg,
  },
  {
    id: "2",
    title: "React Advanced Workshop",
    category: "Workshop",
    date: "Nov 12, 2026",
    location: "Remote",
    attendees: "450",
  },
  {
    id: "3",
    title: "FinTech Networking Night",
    category: "Networking",
    date: "Dec 05, 2026",
    location: "London, UK",
    attendees: "180",
  },
];

const FeaturedEvents = () => (
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

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>

    <Link
      to="/events"
      className="md:hidden flex items-center justify-center gap-2 mt-8 text-sm font-semibold text-primary"
    >
      View all events <ArrowRight className="w-4 h-4" />
    </Link>
  </section>
);

export default FeaturedEvents;
