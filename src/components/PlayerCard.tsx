import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

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
      <div className="relative aspect-square overflow-hidden bg-white p-4">
        {player.headshot_url ? (
          <img
            src={player.headshot_url}
            alt={player.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              // If image fails to load, hide it and show placeholder
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-20 h-20 text-gray-400" strokeWidth={1.5} />
          </div>
        )}
        {player.number && player.number !== '?' && (
          <div className="absolute top-2 right-2 bg-primary text-white font-black text-lg w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
            #{player.number}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors whitespace-nowrap overflow-hidden text-ellipsis" title={player.name}>
          {player.name}
        </h3>
        <p className="text-muted-foreground text-xs mb-3">{player.position}</p>
        
        <div className="bg-muted/50 rounded-lg p-3 mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Raised</p>
          <p className="text-2xl font-black text-primary">
            {formatCurrency(player.total_donations || 0)}
          </p>
        </div>

        <Button 
          className="w-full btn-sports bg-secondary hover:bg-secondary/90 text-sm"
          size="sm"
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
