import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import teamLogo from "@/assets/team-logo.png";
import playerPlaceholder from "@/assets/player-placeholder.jpg";
import { ArrowLeft } from "lucide-react";

interface HeroBannerProps {
  selectedPlayer: any | null;
  teamTotal: number;
  onDonateTeam: () => void;
  onDonatePlayer: (player: any) => void;
  onBackToTeam: () => void;
}

export const HeroBanner = ({
  selectedPlayer,
  teamTotal,
  onDonateTeam,
  onDonatePlayer,
  onBackToTeam,
}: HeroBannerProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/90 to-primary/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {!selectedPlayer ? (
          // Team View
          <div className="animate-fade-in">
            <img 
              src={teamLogo} 
              alt="Team Logo" 
              className="w-32 h-32 mx-auto mb-6 drop-shadow-2xl"
            />
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Bishop Gorman
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
              Girls Flag Football
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              Support our athletes as they compete, grow, and inspire. Every donation helps fund equipment, 
              travel, and opportunities for these incredible young women.
            </p>
            
            {/* Team Total */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto mb-8 border border-white/20">
              <p className="text-white/80 text-sm uppercase tracking-wider mb-2">Total Raised</p>
              <p className="text-6xl font-black text-white mb-2">{formatCurrency(teamTotal)}</p>
              <p className="text-white/70">for the entire team</p>
            </div>

            <Button 
              size="lg" 
              className="text-xl px-12 py-7 bg-primary hover:bg-primary/90 text-white font-bold rounded-full btn-sports shadow-orange animate-pulse-glow"
              onClick={onDonateTeam}
            >
              Donate to the Team
            </Button>
          </div>
        ) : (
          // Player View
          <div className="animate-fade-in">
            <Button 
              variant="ghost" 
              className="absolute top-4 left-4 text-white hover:bg-white/10"
              onClick={onBackToTeam}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Team
            </Button>

            <img 
              src={selectedPlayer.headshot_url || playerPlaceholder} 
              alt={selectedPlayer.name} 
              className="w-48 h-48 rounded-full mx-auto mb-6 border-8 border-white shadow-2xl object-cover"
            />
            
            <div className="inline-block bg-secondary/20 backdrop-blur-sm px-6 py-2 rounded-full mb-4 border border-secondary/30">
              <span className="text-3xl font-black text-white">#{selectedPlayer.number}</span>
              <span className="text-white/80 mx-3">|</span>
              <span className="text-xl text-white/90">{selectedPlayer.position}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
              {selectedPlayer.name}
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              {selectedPlayer.bio}
            </p>

            {/* Player Total */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto mb-8 border border-white/20">
              <p className="text-white/80 text-sm uppercase tracking-wider mb-2">Raised for {selectedPlayer.name.split(' ')[0]}</p>
              <p className="text-6xl font-black text-primary mb-2">{formatCurrency(selectedPlayer.total_donations || 0)}</p>
            </div>

            <Button 
              size="lg" 
              className="text-xl px-12 py-7 bg-primary hover:bg-primary/90 text-white font-bold rounded-full btn-sports shadow-orange animate-pulse-glow"
              onClick={() => onDonatePlayer(selectedPlayer)}
            >
              Support {selectedPlayer.name.split(' ')[0]}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
