import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  id?: string;
  title: string;
  category: string;
  date: string;
  location: string;
  attendees: string;
  imageUrl?: string;
}

const EventCard = ({ id = "1", title, category, date, location, attendees, imageUrl }: EventCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    className="group surface-card hover:surface-card-hover transition-shadow duration-200 p-5"
  >
    <div className="aspect-video w-full bg-secondary rounded-xl mb-4 overflow-hidden relative">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-background/80 backdrop-blur-md text-[10px] font-bold text-primary uppercase tracking-widest">
        {category}
      </div>
    </div>

    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
      {title}
    </h3>

    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4 shrink-0" />
        <span className="tabular-nums">{date}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4 shrink-0" />
        <span>{location}</span>
      </div>
      <div className="pt-4 flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] mt-4">
        <div className="flex items-center gap-1.5 text-sm text-foreground/80">
          <Users className="w-4 h-4" />
          <span className="tabular-nums">{attendees} attending</span>
        </div>
        <Link
          to={`/events/${id}`}
          className="text-xs font-bold text-primary hover:text-primary/80 underline underline-offset-4 transition-colors duration-200"
        >
          Details
        </Link>
      </div>
    </div>
  </motion.div>
);

export default EventCard;
