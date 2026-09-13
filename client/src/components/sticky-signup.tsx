import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Bell, CheckCircle } from "lucide-react";

export default function StickySignup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("sticky-signup-dismissed")) return;

    // Show after 35 seconds OR after scrolling 55% of the page
    const timer = setTimeout(() => setVisible(true), 35000);

    const onScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.55) setVisible(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("sticky-signup-dismissed", "1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !postcode.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          postcode: postcode.trim(),
          source: "sticky-banner",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setTimeout(() => handleDismiss(), 3500);
    } catch {
      setErrorMsg("Could not connect. Please try again.");
      setStatus("error");
    }
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600 flex-shrink-0" />
              {status === "success" ? (
                <p className="font-semibold text-gray-900 text-sm">
                  Done — we'll email you when prices drop
                </p>
              ) : (
                <p className="font-semibold text-gray-900 text-sm">
                  Heating oil prices change every week
                </p>
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {status === "success" ? (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">Check your inbox for a confirmation.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-xs mb-3">
                Enter your postcode and we'll let you know when they fall.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-sm"
                  disabled={status === "loading"}
                  required
                />
                <Input
                  type="text"
                  placeholder="BT1 1AA"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="sm:w-28 text-sm"
                  disabled={status === "loading"}
                  required
                />
                <Button
                  type="submit"
                  disabled={status === "loading" || !email.trim() || !postcode.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm whitespace-nowrap"
                >
                  {status === "loading" ? "Saving..." : "Notify me"}
                </Button>
              </form>
              {status === "error" && (
                <p className="text-red-600 text-xs mt-2">{errorMsg}</p>
              )}
              <p className="text-gray-400 text-xs mt-2">Free. No spam. Unsubscribe any time.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
