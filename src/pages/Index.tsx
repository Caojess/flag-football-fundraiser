import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HeroBanner } from "@/components/HeroBanner";
import { PlayerCard } from "@/components/PlayerCard";
import { DonationModal } from "@/components/DonationModal";
import { RecentDonations } from "@/components/RecentDonations";
import teamLogo from "@/assets/team-logo.png";
import { Trophy, Users, Target } from "lucide-react";

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  slug: string;
  headshot_url: string;
  bio: string;
  total_donations?: number;
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [teamTotal, setTeamTotal] = useState(0);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [donationTarget, setDonationTarget] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
    fetchTeamTotal();
  }, []);

  useEffect(() => {
    const playerSlug = searchParams.get("player");
    if (playerSlug && players.length > 0) {
      const player = players.find((p) => p.slug === playerSlug);
      if (player) {
        setSelectedPlayer(player);
      }
    }
  }, [searchParams, players]);

  const fetchPlayers = async () => {
    try {
      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("*")
        .order("number");

      if (playersError) throw playersError;

      // Fetch donation totals for each player
      const { data: donationsData, error: donationsError } = await supabase
        .from("donations")
        .select("player_id, amount");

      if (donationsError) throw donationsError;

      // Calculate totals
      const totals: Record<string, number> = {};
      donationsData?.forEach((donation) => {
        if (donation.player_id) {
          totals[donation.player_id] = (totals[donation.player_id] || 0) + donation.amount;
        }
      });

      const playersWithTotals = playersData?.map((player) => ({
        ...player,
        total_donations: totals[player.id] || 0,
      }));

      setPlayers(playersWithTotals || []);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamTotal = async () => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("amount");

      if (error) throw error;

      const total = data?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
      setTeamTotal(total);
    } catch (error) {
      console.error("Error fetching team total:", error);
    }
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setSearchParams({ player: player.slug });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToTeam = () => {
    setSelectedPlayer(null);
    setSearchParams({});
  };

  const handleDonateTeam = () => {
    setDonationTarget(null);
    setDonationModalOpen(true);
  };

  const handleDonatePlayer = (player: Player) => {
    setDonationTarget(player);
    setDonationModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={teamLogo} alt="Team Logo" className="w-12 h-12" />
            <div>
              <h1 className="font-black text-lg leading-tight">Bishop Gorman</h1>
              <p className="text-xs text-muted-foreground">Girls Flag Football</p>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20">
        {/* Hero Banner */}
        <HeroBanner
          selectedPlayer={selectedPlayer}
          teamTotal={teamTotal}
          onDonateTeam={handleDonateTeam}
          onDonatePlayer={handleDonatePlayer}
          onBackToTeam={handleBackToTeam}
        />

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-4xl font-black text-primary mb-2">12</h3>
                <p className="text-muted-foreground">Star Athletes</p>
              </div>
              <div className="text-center">
                <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-4xl font-black text-secondary mb-2">{players.length}</h3>
                <p className="text-muted-foreground">Team Members</p>
              </div>
              <div className="text-center">
                <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-4xl font-black text-accent mb-2">100%</h3>
                <p className="text-muted-foreground">Dedication</p>
              </div>
            </div>
          </div>
        </section>

        {/* Player Roster */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
              Meet Our Athletes
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
              Click on any player to learn more and support them individually
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isSelected={selectedPlayer?.id === player.id}
                  onClick={() => handlePlayerClick(player)}
                  onDonate={() => handleDonatePlayer(player)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Recent Donations Feed */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <RecentDonations />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-foreground text-background">
          <div className="container mx-auto px-4 text-center">
            <img src={teamLogo} alt="Team Logo" className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <p className="text-sm opacity-70">
              © 2025 Bishop Gorman Girls Flag Football. All rights reserved.
            </p>
            <p className="text-xs opacity-50 mt-2">
              Built with ❤️ to support our amazing athletes
            </p>
          </div>
        </footer>
      </div>

      {/* Donation Modal */}
      <DonationModal
        open={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        player={donationTarget}
      />
    </div>
  );
};

export default Index;
