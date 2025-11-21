import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";

interface Donation {
  id: string;
  amount: number;
  donor_name: string;
  message: string;
  display_publicly: boolean;
  created_at: string;
  player_id: string;
  players?: {
    name: string;
    number: number;
  };
}

export const RecentDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select(`
          *,
          players:player_id (name, number)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-black flex items-center gap-3">
        <Heart className="text-primary" />
        Recent Donations
      </h2>

      <div className="space-y-3">
        {donations.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No donations yet. Be the first to support!</p>
          </Card>
        ) : (
          donations.map((donation) => (
            <Card key={donation.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-lg">
                      {donation.display_publicly ? donation.donor_name : "Anonymous"}
                    </p>
                    <span className="text-muted-foreground text-sm">
                      {formatTimeAgo(donation.created_at)}
                    </span>
                  </div>
                  
                  {donation.players ? (
                    <p className="text-sm text-muted-foreground mb-1">
                      donated to <span className="font-semibold text-secondary">
                        #{donation.players.number} {donation.players.name}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-1">
                      donated to <span className="font-semibold text-primary">the team</span>
                    </p>
                  )}

                  {donation.message && donation.display_publicly && (
                    <p className="text-sm italic text-muted-foreground mt-2">
                      "{donation.message}"
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black text-primary">
                    {formatCurrency(donation.amount)}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
