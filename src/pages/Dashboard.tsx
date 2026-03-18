import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, Users } from "lucide-react";
import AIDescriptionGenerator from "@/components/AIDescriptionGenerator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import usePageMeta from "@/hooks/usePageMeta";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface EventForm {
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  organiser_name: string;
  cover_image_url: string;
  max_capacity: number;
}

const emptyForm: EventForm = {
  title: "",
  description: "",
  category: "Conference",
  date: "",
  location: "",
  organiser_name: "",
  cover_image_url: "",
  max_capacity: 100,
};

const categories = ["Conference", "Workshop", "Networking", "Concert"];

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);

  // Ticket type form state
  const [ticketForm, setTicketForm] = useState({ name: "", price: 0, quantity_available: 50 });
  const [addingTicketsFor, setAddingTicketsFor] = useState<string | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ["dashboard_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: regCounts } = useQuery({
    queryKey: ["dashboard_reg_counts"],
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

  const { data: ticketTypes } = useQuery({
    queryKey: ["dashboard_ticket_types"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ticket_types").select("*");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await supabase
          .from("events")
          .update({ ...form, date: new Date(form.date).toISOString() })
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("events")
          .insert({ ...form, date: new Date(form.date).toISOString(), user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard_events"] });
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success(editingId ? "Event updated!" : "Event created!");
    },
    onError: () => toast.error("Failed to save event."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase.from("events").delete().eq("id", eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard_events"] });
      toast.success("Event deleted.");
    },
  });

  const addTicketMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("ticket_types").insert({
        event_id: addingTicketsFor!,
        name: ticketForm.name,
        price: ticketForm.price,
        quantity_available: ticketForm.quantity_available,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard_ticket_types"] });
      setTicketForm({ name: "", price: 0, quantity_available: 50 });
      setAddingTicketsFor(null);
      toast.success("Ticket type added!");
    },
  });

  const handleEdit = (event: typeof events extends (infer T)[] | undefined ? T : never) => {
    if (!event) return;
    setForm({
      title: event.title,
      description: event.description || "",
      category: event.category,
      date: event.date.slice(0, 16),
      location: event.location,
      organiser_name: event.organiser_name,
      cover_image_url: event.cover_image_url || "",
      max_capacity: event.max_capacity,
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location || !form.organiser_name) return;
    saveMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage your events.</p>
          </div>
          <button
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(true);
            }}
            className="h-10 px-5 btn-primary rounded-lg text-sm flex items-center gap-2 transition-all hover:brightness-110 active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Event
          </button>
        </div>

        {/* Create / Edit form */}
        {showForm && (
          <div className="surface-card p-6 mb-10">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Event" : "Create Event"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Title"
                required
                maxLength={200}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-11 px-4 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-11 px-4 bg-secondary rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="datetime-local"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="h-11 px-4 bg-secondary rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                placeholder="Location"
                required
                maxLength={200}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="h-11 px-4 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                placeholder="Organiser Name"
                required
                maxLength={100}
                value={form.organiser_name}
                onChange={(e) => setForm({ ...form, organiser_name: e.target.value })}
                className="h-11 px-4 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="number"
                placeholder="Max Capacity"
                min={1}
                value={form.max_capacity}
                onChange={(e) => setForm({ ...form, max_capacity: Number(e.target.value) })}
                className="h-11 px-4 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                placeholder="Cover Image URL (optional)"
                value={form.cover_image_url}
                onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                className="sm:col-span-2 h-11 px-4 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <AIDescriptionGenerator
                onGenerated={(desc) => setForm({ ...form, description: desc })}
              />
              <div className="sm:col-span-2 space-y-1">
                <textarea
                  placeholder="Description"
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <p className="text-xs text-muted-foreground text-right tabular-nums">
                  {form.description.length} characters
                </p>
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="h-10 px-6 btn-primary rounded-lg text-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  {saveMutation.isPending
                    ? "Saving…"
                    : editingId
                      ? "Update Event"
                      : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="h-10 px-6 btn-secondary rounded-lg text-sm transition-all hover:bg-secondary/80"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add ticket type form */}
        {addingTicketsFor && (
          <div className="surface-card p-6 mb-10">
            <h2 className="text-lg font-semibold mb-4">Add Ticket Type</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTicketMutation.mutate();
              }}
              className="flex flex-wrap gap-3 items-end"
            >
              <input
                placeholder="Name (e.g. VIP)"
                required
                value={ticketForm.name}
                onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                className="h-11 px-4 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="number"
                placeholder="Price"
                min={0}
                step={0.01}
                value={ticketForm.price}
                onChange={(e) => setTicketForm({ ...ticketForm, price: Number(e.target.value) })}
                className="h-11 w-28 px-4 bg-secondary rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="number"
                placeholder="Qty"
                min={1}
                value={ticketForm.quantity_available}
                onChange={(e) => setTicketForm({ ...ticketForm, quantity_available: Number(e.target.value) })}
                className="h-11 w-24 px-4 bg-secondary rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="h-11 px-5 btn-primary rounded-lg text-sm transition-all hover:brightness-110 active:scale-95"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setAddingTicketsFor(null)}
                className="h-11 px-5 btn-secondary rounded-lg text-sm"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Events list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="surface-card h-24 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => {
              const eventTickets = ticketTypes?.filter((t) => t.event_id === event.id) || [];
              return (
                <div key={event.id} className="surface-card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg truncate">{event.title}</h3>
                        <span className="shrink-0 px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                          {event.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.location} ·{" "}
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {/* Ticket types */}
                      {eventTickets.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {eventTickets.map((t) => (
                            <span key={t.id} className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">
                              {t.name}: {t.price === 0 ? "Free" : `$${Number(t.price).toFixed(2)}`} ({t.quantity_available} left)
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1.5 text-sm text-foreground/80">
                        <Users className="w-4 h-4" />
                        <span className="tabular-nums font-medium">
                          {regCounts?.[event.id] || 0}
                        </span>
                      </div>
                      <button
                        onClick={() => setAddingTicketsFor(event.id)}
                        className="h-8 px-3 btn-secondary rounded-lg text-xs transition-all hover:bg-secondary/80"
                        title="Add ticket type"
                      >
                        + Ticket
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(event.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No events yet. Create your first event!
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
