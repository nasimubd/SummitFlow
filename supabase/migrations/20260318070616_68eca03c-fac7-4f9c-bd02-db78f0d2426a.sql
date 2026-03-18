-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  organiser_name TEXT NOT NULL,
  cover_image_url TEXT,
  max_capacity INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ticket_types table
CREATE TABLE public.ticket_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  quantity_available INTEGER NOT NULL DEFAULT 0
);

-- Create registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_type_id UUID NOT NULL REFERENCES public.ticket_types(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Events: publicly readable
CREATE POLICY "Events are publicly readable"
  ON public.events FOR SELECT USING (true);

CREATE POLICY "Anyone can create events"
  ON public.events FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update events"
  ON public.events FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete events"
  ON public.events FOR DELETE USING (true);

-- Ticket types
CREATE POLICY "Ticket types are publicly readable"
  ON public.ticket_types FOR SELECT USING (true);

CREATE POLICY "Anyone can create ticket types"
  ON public.ticket_types FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update ticket types"
  ON public.ticket_types FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete ticket types"
  ON public.ticket_types FOR DELETE USING (true);

-- Registrations
CREATE POLICY "Registrations are publicly readable"
  ON public.registrations FOR SELECT USING (true);

CREATE POLICY "Anyone can register"
  ON public.registrations FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_ticket_types_event_id ON public.ticket_types(event_id);
CREATE INDEX idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX idx_registrations_ticket_type_id ON public.registrations(ticket_type_id);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_date ON public.events(date);