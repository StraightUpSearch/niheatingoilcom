import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, CheckCircle } from "lucide-react";

interface PriceAlertBarProps {
  postcode?: string;
  volume?: number;
}

export default function PriceAlertBar({ postcode, volume }: PriceAlertBarProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !postcode) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          postcode,
          volume: volume || null,
          source: "search-bar",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Something went wrong. Try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Could not connect. Please try again.");
      setStatus("error");
    }
  };

  if (!postcode) return null;

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-green-900 text-sm">You're on the list</p>
          <p className="text-green-700 text-xs mt-0.5">
            We'll email you when prices drop in {postcode}. Check your inbox for confirmation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <Bell className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm">
            Prices for {postcode} change weekly
          </p>
          <p className="text-blue-700 text-xs mt-0.5">
            Get an email when they drop — no account needed.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white border-blue-300 focus:border-blue-500 text-sm"
          disabled={status === "loading"}
          required
        />
        <Button
          type="submit"
          disabled={status === "loading" || !email.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 whitespace-nowrap"
        >
          {status === "loading" ? "Saving..." : "Alert me"}
        </Button>
      </form>
      {status === "error" && (
        <p className="text-red-600 text-xs mt-2">{errorMsg}</p>
      )}
    </div>
  );
}
