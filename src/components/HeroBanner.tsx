import { Button } from "@/components/ui/button";
// Video removed from git due to file size - will host on CDN later
// import heroBgVideo from "@/assets/hero-bg.mp4";
import teamLogo from "@/assets/team-logo.png";
import { ArrowLeft, User } from "lucide-react";

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
    <div className="relative min-h-[240px] flex items-center justify-center overflow-hidden">
      {/* Background - Video removed temporarily (too large for git) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-primary" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 text-center">
        {!selectedPlayer ? (
          // Team View
          <div className="animate-fade-in">
            <img 
              src={teamLogo} 
              alt="Team Logo" 
              className="w-20 h-20 mx-auto mb-3 drop-shadow-2xl"
            />
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">
              Bishop Gorman
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              Girls Flag Football
            </h2>
            <p className="text-base text-white/90 max-w-2xl mx-auto mb-4 leading-relaxed">
              Support our athletes as they compete, grow, and inspire. Every donation helps fund equipment, 
              travel, and opportunities for these incredible young women.
            </p>
            
            {/* Team Total */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 max-w-md mx-auto mb-4 border border-white/20">
              <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Total Raised</p>
              <p className="text-4xl font-black text-white mb-1">{formatCurrency(teamTotal)}</p>
              <p className="text-white/70 text-sm">for the entire team</p>
            </div>

            <Button 
              size="lg" 
              className="text-lg px-8 py-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-full btn-sports shadow-orange animate-pulse-glow"
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

            {selectedPlayer.headshot_url ? (
              <img 
                src={selectedPlayer.headshot_url} 
                alt={selectedPlayer.name} 
                className="w-32 h-32 rounded-full mx-auto mb-3 border-4 border-white shadow-2xl object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-3 border-4 border-white shadow-2xl bg-gray-200 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
              </div>
            )}
            
            {/* Jersey number commented out until numbers are available
            <div className="inline-block bg-secondary/20 backdrop-blur-sm px-4 py-1 rounded-full mb-2 border border-secondary/30">
              <span className="text-2xl font-black text-white">#{selectedPlayer.number}</span>
              <span className="text-white/80 mx-2">|</span>
              <span className="text-lg text-white/90">{selectedPlayer.position}</span>
            </div>
            */}

            <div className="inline-block bg-secondary/20 backdrop-blur-sm px-4 py-1 rounded-full mb-2 border border-secondary/30">
              <span className="text-lg text-white/90">{selectedPlayer.position}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
              {selectedPlayer.name}
            </h1>
            
            <p className="text-base text-white/90 max-w-2xl mx-auto mb-4 leading-relaxed">
              {selectedPlayer.bio}
            </p>

            {/* Player Total */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 max-w-md mx-auto mb-4 border border-white/20">
              <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Raised for {selectedPlayer.name.split(' ')[0]}</p>
              <p className="text-4xl font-black text-primary mb-1">{formatCurrency(selectedPlayer.total_donations || 0)}</p>
            </div>

            <Button 
              size="lg" 
              className="text-lg px-8 py-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-full btn-sports shadow-orange animate-pulse-glow"
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
