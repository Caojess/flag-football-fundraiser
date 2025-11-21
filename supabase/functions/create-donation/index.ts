import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, donorName, donorEmail, message, playerId, displayPublicly } = await req.json();

    console.log("[create-donation] Request received", { amount, donorName, donorEmail, playerId });

    // Validate input
    if (!amount || amount < 500) {
      throw new Error("Minimum donation amount is $5.00");
    }
    if (!donorName || !donorEmail) {
      throw new Error("Donor name and email are required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    console.log("[create-donation] Creating Stripe payment intent");

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: donorEmail,
      metadata: {
        donor_name: donorName,
        player_id: playerId || "team",
      },
    });

    console.log("[create-donation] Payment intent created", { id: paymentIntent.id });

    // Initialize Supabase with service role key for inserting
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Insert donation record
    const { data: donation, error: dbError } = await supabaseAdmin
      .from("donations")
      .insert({
        amount,
        donor_name: donorName,
        donor_email: donorEmail,
        message: message || null,
        player_id: playerId || null,
        display_publicly: displayPublicly || false,
        stripe_payment_intent_id: paymentIntent.id,
      })
      .select()
      .single();

    if (dbError) {
      console.error("[create-donation] Database error", dbError);
      throw new Error(`Failed to record donation: ${dbError.message}`);
    }

    console.log("[create-donation] Donation recorded", { donationId: donation.id });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        donationId: donation.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[create-donation] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
