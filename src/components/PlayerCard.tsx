import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import playerPlaceholder from "@/assets/player-placeholder.jpg";

interface PlayerCardProps {
  player: any;
  isSelected: boolean;
  onClick: () => void;
  onDonate: () => void;
}

export const PlayerCard = ({ player, isSelected, onClick, onDonate }: PlayerCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden ${
        isSelected ? 'ring-4 ring-primary shadow-orange' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={player.headshot_url || playerPlaceholder}
          alt={player.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-primary text-white font-black text-2xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
          #{player.number}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-2xl mb-1 group-hover:text-primary transition-colors">
          {player.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">{player.position}</p>
        
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Raised</p>
          <p className="text-3xl font-black text-primary">
            {formatCurrency(player.total_donations || 0)}
          </p>
        </div>

        <Button 
          className="w-full btn-sports bg-secondary hover:bg-secondary/90"
          onClick={(e) => {
            e.stopPropagation();
            onDonate();
          }}
        >
          Support Player
        </Button>
      </div>
    </Card>
  );
};
