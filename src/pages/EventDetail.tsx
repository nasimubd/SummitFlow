import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventChatWidget from "@/components/EventChatWidget";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: ticketTypes } = useQuery({
    queryKey: ["ticket_types", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_types")
        .select("*")
        .eq("event_id", id!);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: regCount } = useQuery({
    queryKey: ["registration_count", id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", id!);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!id,
  });

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="h-64 surface-card animate-pulse rounded-2xl mb-8" />
          <div className="h-8 w-1/2 bg-secondary rounded animate-pulse mb-4" />
          <div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-muted-foreground text-lg">Event not found.</p>
          <Link to="/events" className="text-primary mt-4 inline-block">
            ← Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to events
        </Link>

        {/* Cover */}
        {event.cover_image_url && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8">
            <img
              src={event.cover_image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Badge */}
        <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
          {event.category}
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {event.title}
        </h1>

        <div className="flex flex-wrap gap-6 text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="tabular-nums">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="tabular-nums">
              {regCount} / {event.max_capacity} registered
            </span>
          </div>
        </div>

        <p className="text-foreground/80 leading-relaxed mb-12 whitespace-pre-line">
          {event.description || "No description provided."}
        </p>

        {/* Ticket Types */}
        <h2 className="text-xl font-bold tracking-tight mb-6">Tickets</h2>
        {ticketTypes && ticketTypes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {ticketTypes.map((t) => (
              <div
                key={t.id}
                className="surface-card p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t.name}</h3>
                  <p className="text-2xl font-bold text-primary tabular-nums">
                    {t.price === 0 ? "Free" : `$${Number(t.price).toFixed(2)}`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 tabular-nums">
                    {t.quantity_available} spots left
                  </p>
                </div>
                <Link
                  to={`/events/${event.id}/register?ticket=${t.id}`}
                  className="mt-4 h-10 btn-primary rounded-lg flex items-center justify-center text-sm transition-all duration-200 hover:brightness-110 active:scale-95"
                >
                  Register
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-12">
            No ticket types available yet.
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Organised by{" "}
          <span className="text-foreground font-medium">
            {event.organiser_name}
          </span>
        </p>
      </main>
      <Footer />

      {/* AI Chat Widget */}
      {event && ticketTypes && (
        <EventChatWidget
          eventContext={{
            title: event.title,
            date: new Date(event.date).toLocaleString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }),
            location: event.location,
            category: event.category,
            description: event.description,
            organiser: event.organiser_name,
            maxCapacity: event.max_capacity,
            tickets: ticketTypes.map((t) => ({
              name: t.name,
              price: Number(t.price),
              available: t.quantity_available,
            })),
          }}
        />
      )}
    </div>
  );
};

export default EventDetail;
