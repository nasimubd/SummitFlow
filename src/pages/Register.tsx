import { useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, Calendar, MapPin, Ticket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import usePageMeta from "@/hooks/usePageMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Register = () => {
  usePageMeta("Register", "Register for an event on EventFlow AI.");
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const preselectedTicket = searchParams.get("ticket");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ticketId, setTicketId] = useState(preselectedTicket || "");
  const [success, setSuccess] = useState(false);

  const { data: event } = useQuery({
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

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("registrations").insert({
        event_id: id!,
        ticket_type_id: ticketId,
        attendee_name: name.trim(),
        attendee_email: email.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["registration_count", id] });
      toast.success("Registration successful!");
    },
    onError: () => {
      toast.error("Registration failed. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !ticketId) return;
    mutation.mutate();
  };

  if (success) {
    const selectedTicket = ticketTypes?.find((t) => t.id === ticketId);
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-20">
          <div className="surface-card p-8 text-center">
            <CheckCircle className="w-14 h-14 text-primary mx-auto mb-5" />
            <h1 className="text-2xl font-bold mb-1">You're registered!</h1>
            <p className="text-muted-foreground text-sm mb-6">
              Check your email for confirmation details.
            </p>

            <div className="text-left space-y-3 py-5 border-y border-[rgba(255,255,255,0.05)]">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Event</p>
                  <p className="text-sm font-medium">{event?.title}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Attendee</p>
                  <p className="text-sm font-medium">{name}</p>
                </div>
              </div>
              {selectedTicket && (
                <div className="flex items-start gap-3">
                  <Ticket className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ticket</p>
                    <p className="text-sm font-medium">
                      {selectedTicket.name} —{" "}
                      {selectedTicket.price === 0
                        ? "Free"
                        : `$${Number(selectedTicket.price).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <Link
                to={`/events/${id}`}
                className="h-10 btn-primary rounded-lg flex items-center justify-center text-sm transition-all hover:brightness-110"
              >
                Back to Event
              </Link>
              <Link
                to="/events"
                className="h-10 btn-secondary rounded-lg flex items-center justify-center text-sm transition-all hover:bg-secondary/80"
              >
                Browse More Events
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-lg mx-auto px-6 py-12">
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to event
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-2">Register</h1>
        {event && (
          <p className="text-muted-foreground mb-8">
            Registering for{" "}
            <span className="text-foreground font-medium">{event.title}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Name</label>
            <input
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Ticket Type
            </label>
            <select
              required
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              className="w-full h-11 px-4 bg-secondary rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            >
              <option value="">Select a ticket</option>
              {ticketTypes?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.price === 0 ? "Free" : `$${Number(t.price).toFixed(2)}`}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-12 btn-primary rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {mutation.isPending ? "Registering…" : "Complete Registration"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
