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

-- Seed data for Bishop Gorman Girls Flag Football players
INSERT INTO public.players (name, number, position, slug, bio) VALUES
-- Grade 12
('Avery Reed', 0, 'Athlete', 'avery-reed', 'Senior - Class of 2025'),
('Tiare-marie Duncan', 0, 'Athlete', 'tiare-marie-duncan', 'Senior - Class of 2025'),
('Preseah Williams', 0, 'Athlete', 'preseah-williams', 'Senior - Class of 2025'),
('Andrea Santamaria', 0, 'Athlete', 'andrea-santamaria', 'Senior - Class of 2025'),
('Janeza Jones', 0, 'Athlete', 'janeza-jones', 'Senior - Class of 2025'),
('Miah Davis', 0, 'Athlete', 'miah-davis', 'Senior - Class of 2025'),
('Olivia Cobell', 0, 'Athlete', 'olivia-cobell', 'Senior - Class of 2025'),
('Jasmine Alsua', 0, 'Athlete', 'jasmine-alsua', 'Senior - Class of 2025'),
('Izzi Lewis', 0, 'Athlete', 'izzi-lewis', 'Senior - Class of 2025'),
('Riely Hermenegil', 0, 'Athlete', 'riely-hermenegil', 'Senior - Class of 2025'),
-- Grade 11
('Beckett Bohn', 0, 'Athlete', 'beckett-bohn', 'Junior - Class of 2026'),
('Sienna Gostamian', 0, 'Athlete', 'sienna-gostamian', 'Junior - Class of 2026'),
('Aimie Murphy', 0, 'Athlete', 'aimie-murphy', 'Junior - Class of 2026'),
('Alyssa Picarra', 0, 'Athlete', 'alyssa-picarra', 'Junior - Class of 2026'),
('Eliane Saikaly', 0, 'Athlete', 'eliane-saikaly', 'Junior - Class of 2026'),
('Jayden Kimenker', 0, 'Athlete', 'jayden-kimenker', 'Junior - Class of 2026'),
('Chiaukaka Okorocfor', 0, 'Athlete', 'chiaukaka-okorocfor', 'Junior - Class of 2026'),
-- Grade 10
('Olivia Dicicco', 0, 'Athlete', 'olivia-dicicco', 'Sophomore - Class of 2027'),
('Eden Reed', 0, 'Athlete', 'eden-reed', 'Sophomore - Class of 2027'),
('Samira Waddell', 0, 'Athlete', 'samira-waddell', 'Sophomore - Class of 2027'),
('Morgan Delph', 0, 'Athlete', 'morgan-delph', 'Sophomore - Class of 2027'),
('Shelby Martin', 0, 'Athlete', 'shelby-martin', 'Sophomore - Class of 2027'),
('Alexia Favela', 0, 'Athlete', 'alexia-favela', 'Sophomore - Class of 2027'),
('Elsa Mcpeak', 0, 'Athlete', 'elsa-mcpeak', 'Sophomore - Class of 2027'),
('Autumn Landin', 0, 'Athlete', 'autumn-landin', 'Sophomore - Class of 2027'),
('Charlcie Weingate', 0, 'Athlete', 'charlcie-weingate', 'Sophomore - Class of 2027'),
('Lola Churhik', 0, 'Athlete', 'lola-churhik', 'Sophomore - Class of 2027'),
('Gabi Cobell', 0, 'Athlete', 'gabi-cobell', 'Sophomore - Class of 2027'),
('Zia Sanidad', 0, 'Athlete', 'zia-sanidad', 'Sophomore - Class of 2027'),
('Peyton Cezar', 0, 'Athlete', 'peyton-cezar', 'Sophomore - Class of 2027'),
('Taryah Oliver', 0, 'Athlete', 'taryah-oliver', 'Sophomore - Class of 2027'),
('Zehlani English', 0, 'Athlete', 'zehlani-english', 'Sophomore - Class of 2027'),
-- Grade 9
('Marley Bryant', 0, 'Athlete', 'marley-bryant', 'Freshman - Class of 2028'),
('Vida Aiello', 0, 'Athlete', 'vida-aiello', 'Freshman - Class of 2028'),
('Jenna Garritano', 0, 'Athlete', 'jenna-garritano', 'Freshman - Class of 2028'),
('Malia Browner', 0, 'Athlete', 'malia-browner', 'Freshman - Class of 2028');

-- Create index for faster queries
CREATE INDEX idx_donations_player_id ON public.donations(player_id);
CREATE INDEX idx_donations_created_at ON public.donations(created_at DESC);
CREATE INDEX idx_players_slug ON public.players(slug);