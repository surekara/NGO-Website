import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link2, Copy, Check, ArrowRight, Heart, Share2, Sparkles } from "lucide-react";

const BASE_DONATE_URL = "https://prachetasfoundation.com/donate";

const generateSlug = (name: string) => {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
};

const CreateFundraiserLink = () => {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const personalLink = slug ? `${BASE_DONATE_URL}?ref=${slug}` : "";

  const handleCreate = async () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    setError(null);
    setLoading(true);

    const generatedSlug = generateSlug(name);

    try {
      const res = await fetch("/.netlify/functions/fundraiser-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: generatedSlug,
          studentName: name.trim(),
          rollNo: "",
          batch: org.trim() || "Supporter",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSlug(data.link.slug);
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(personalLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const shareLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Support Prachetas Foundation via ${name}'s link`,
        text: `I'm raising funds for Prachetas Foundation! Every donation made via my link is tracked. Please donate here:`,
        url: personalLink,
      });
    } else {
      copyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="py-16 bg-black text-white text-center px-4">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Sparkles size={14} /> Fundraiser Links
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Create Your Personal <br />
            <span className="text-yellow-400">Donation Link</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Share a unique link with your friends and family. Every donation made through your
            link is tracked under your name — helping us recognise your contribution.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 grid md:grid-cols-3 gap-6 text-center">
          {[
            { step: "1", icon: "✍️", title: "Enter your name", desc: "Just your name. No account needed." },
            { step: "2", icon: "🔗", title: "Get your link", desc: "A unique donation URL is generated instantly." },
            { step: "3", icon: "📢", title: "Share & track", desc: "Every donation via your link is attributed to you." },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="flex flex-col items-center">
              <div className="text-3xl mb-3">{icon}</div>
              <div className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-1">Step {step}</div>
              <div className="font-bold text-gray-900 mb-1">{title}</div>
              <div className="text-sm text-gray-500">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main card */}
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          {!submitted ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Link2 size={18} className="text-yellow-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Generate My Link</div>
                  <div className="text-xs text-gray-400">Takes less than 10 seconds</div>
                </div>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 placeholder-gray-400"
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>

              {/* Organisation (optional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Organisation / College{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="e.g. COEP, Rotary Club, etc."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 placeholder-gray-400"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
                  {error}
                </p>
              )}

              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-black font-bold py-3.5 rounded-xl text-base transition-all shadow hover:shadow-md"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Sparkles size={16} /> Generate My Link <ArrowRight size={16} /></>
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                By creating a link you agree to fundraise for Prachetas Foundation in good faith.
              </p>
            </div>
          ) : (
            /* Success card */
            <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Your link is ready, {name.split(" ")[0]}!
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Share it anywhere — WhatsApp, Instagram, email, or in person.
                Every donation via this link is tracked under your name.
              </p>

              {/* Link box */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 text-left">
                <span className="flex-1 text-sm text-gray-700 truncate font-mono">{personalLink}</span>
                <button
                  onClick={copyLink}
                  className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    copied ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={shareLink}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white font-bold py-3 rounded-xl text-sm hover:bg-gray-900 transition-all"
                >
                  <Share2 size={15} /> Share Link
                </button>
                <a
                  href={personalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl text-sm transition-all"
                >
                  <Heart size={15} /> Preview Page
                </a>
              </div>

              <button
                onClick={() => { setSubmitted(false); setName(""); setOrg(""); setSlug(null); }}
                className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
              >
                Create another link
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreateFundraiserLink;
