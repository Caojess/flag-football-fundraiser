-- Create players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  number INTEGER NOT NULL,
  position TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  headshot_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount INTEGER NOT NULL, -- Amount in cents
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  message TEXT,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  display_publicly BOOLEAN DEFAULT false,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for players - publicly readable
CREATE POLICY "Players are viewable by everyone"
ON public.players FOR SELECT
USING (true);

-- RLS Policies for donations - publicly readable (for totals/feed)
CREATE POLICY "Donations are viewable by everyone"
ON public.donations FOR SELECT
USING (true);

-- Only backend can insert donations (via edge function)
CREATE POLICY "Donations can be inserted via service role"
ON public.donations FOR INSERT
WITH CHECK (true);

-- Seed data for demo players
INSERT INTO public.players (name, number, position, slug, bio) VALUES
('Emma Rodriguez', 7, 'Quarterback', 'emma-rodriguez', 'Senior leader with exceptional arm strength and field vision. Three-year varsity starter.'),
('Sophia Chen', 12, 'Wide Receiver', 'sophia-chen', 'Lightning-fast receiver with incredible hands. State record holder for receiving yards.'),
('Madison Torres', 23, 'Running Back', 'madison-torres', 'Explosive running back known for breaking tackles and making big plays.'),
('Olivia Martinez', 4, 'Defensive Back', 'olivia-martinez', 'Lockdown corner with 8 interceptions this season. All-state honors.'),
('Ava Johnson', 88, 'Wide Receiver', 'ava-johnson', 'Clutch performer who always comes through in critical moments.'),
('Isabella Garcia', 33, 'Linebacker', 'isabella-garcia', 'Team captain and defensive leader. Leads the team in tackles.'),
('Mia Thompson', 19, 'Safety', 'mia-thompson', 'Hard-hitting safety with great instincts and game awareness.'),
('Charlotte Davis', 5, 'Quarterback', 'charlotte-davis', 'Backup QB with a strong arm and high football IQ.'),
('Amelia Wilson', 11, 'Running Back', 'amelia-wilson', 'Versatile back who excels in both rushing and receiving.'),
('Harper Anderson', 21, 'Defensive Back', 'harper-anderson', 'Aggressive corner known for her physicality and press coverage.'),
('Evelyn Brown', 44, 'Linebacker', 'evelyn-brown', 'Tough linebacker who never backs down from contact.'),
('Abigail Lee', 8, 'Wide Receiver', 'abigail-lee', 'Speedy slot receiver with excellent route running ability.');

-- Create index for faster queries
CREATE INDEX idx_donations_player_id ON public.donations(player_id);
CREATE INDEX idx_donations_created_at ON public.donations(created_at DESC);
CREATE INDEX idx_players_slug ON public.players(slug);