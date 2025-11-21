import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51QcUJNI2YbnwkB1iC0LyIFj6oRNgUMJKKvGj9R1K1TE53bHqjB9H7vqDUPOSQnmg7gzGqQRO0aZYM4G0qqBGQKKy00sAYwDqVk");

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  player: any | null;
}

const CheckoutForm = ({ donorName, donorEmail, amount, message, displayPublicly, playerId, onSuccess }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/?success=true`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thank You!",
          description: "Your donation has been received successfully.",
        });
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred processing your donation.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full btn-sports bg-primary hover:bg-primary/90"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Donate $${(amount / 100).toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

export const DonationModal = ({ open, onClose, player }: DonationModalProps) => {
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [displayPublicly, setDisplayPublicly] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const { toast } = useToast();

  const handleCreatePayment = async () => {
    // Validation
    if (!donorName.trim() || !donorEmail.trim() || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amountInCents = Math.round(parseFloat(amount) * 100);
    
    if (amountInCents < 500) {
      toast({
        title: "Minimum Amount",
        description: "Minimum donation is $5.00",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingPayment(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-donation", {
        body: {
          amount: amountInCents,
          donorName,
          donorEmail,
          message: message || null,
          playerId: player?.id || null,
          displayPublicly,
        },
      });

      if (error) throw error;

      setClientSecret(data.clientSecret);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize donation",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handleSuccess = () => {
    onClose();
    setDonorName("");
    setDonorEmail("");
    setAmount("");
    setMessage("");
    setDisplayPublicly(false);
    setClientSecret(null);
    window.location.reload(); // Reload to show updated totals
  };

  const handleClose = () => {
    onClose();
    setClientSecret(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black">
            {player ? `Support ${player.name}` : "Support the Team"}
          </DialogTitle>
        </DialogHeader>

        {!clientSecret ? (
          <div className="space-y-6">
            {player && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 text-center border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Donating to</p>
                <p className="font-bold text-xl">{player.name}</p>
                <p className="text-sm text-muted-foreground">{player.position}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-base font-semibold">Select Amount *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2 mb-3">
                  {[10, 25, 50, 100, 250, 500].map((presetAmount) => (
                    <Button
                      key={presetAmount}
                      type="button"
                      variant={amount === presetAmount.toString() ? "default" : "outline"}
                      className={`${amount === presetAmount.toString() ? 'bg-primary text-white' : ''}`}
                      onClick={() => setAmount(presetAmount.toString())}
                    >
                      ${presetAmount}
                    </Button>
                  ))}
                </div>
                <Input
                  id="amount"
                  type="number"
                  min="5"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Or enter custom amount"
                  required
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-muted-foreground mt-1">Minimum donation: $5.00</p>
              </div>

              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Your Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave an encouraging message..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="public"
                  checked={displayPublicly}
                  onCheckedChange={(checked) => setDisplayPublicly(checked as boolean)}
                />
                <Label htmlFor="public" className="text-sm cursor-pointer">
                  Display my name publicly
                </Label>
              </div>
            </div>

            <Button 
              onClick={handleCreatePayment}
              disabled={isCreatingPayment}
              className="w-full btn-sports bg-secondary hover:bg-secondary/90"
              size="lg"
            >
              {isCreatingPayment ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Preparing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              donorName={donorName}
              donorEmail={donorEmail}
              amount={Math.round(parseFloat(amount) * 100)}
              message={message}
              displayPublicly={displayPublicly}
              playerId={player?.id || null}
              onSuccess={handleSuccess}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
};
