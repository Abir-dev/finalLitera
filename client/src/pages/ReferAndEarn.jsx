import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

export default function ReferAndEarn() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const apiEnv = import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
  const api = useMemo(() => axios.create({ baseURL: apiEnv, headers: { "Content-Type": "application/json" } }), [apiEnv]);

  useEffect(() => {
    (async () => {
      if (!user) { setLoading(false); return; }
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/users/referral/me", { headers: { Authorization: `Bearer ${token}` } });
        setData(res.data?.data);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, api]);

  const inviteText = useMemo(() => {
    const link = data?.inviteLink || window.location.origin + "/signup";
    return `🎉 Join Litera and get 10% off your first course! 

Use my referral code: ${data?.referralCode || ""}

Sign up here: ${link}

Start your learning journey with amazing courses! 🚀`;
  }, [data]);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show a better notification
      const notification = document.createElement('div');
      notification.textContent = '✅ Copied to clipboard!';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        alert("Copied to clipboard");
      } catch {}
    }
  };

  const refreshReferral = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // If no referralCode, attempt regenerate, otherwise just refetch
      if (!data?.referralCode) {
        await api.post("/users/referral/regenerate", {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      const res = await api.get("/users/referral/me", { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data?.data);
    } catch (e) {
      alert("Failed to refresh referral details");
    } finally {
      setLoading(false);
    }
  };

  const share = async (platform) => {
    const url = encodeURIComponent(data?.inviteLink || window.location.origin + "/signup");
    const text = encodeURIComponent(inviteText);
    const code = encodeURIComponent(data?.referralCode || "");
    const title = encodeURIComponent("Litera Refer & Earn");

    if (navigator.share && platform === "native") {
      try { await navigator.share({ title: "Litera Refer & Earn", text: inviteText, url: data?.inviteLink }); } catch {}
      return;
    }

    const routes = {
      whatsapp: `https://wa.me/?text=${text}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${title}&body=${text}`,
    };
    const shareUrl = routes[platform];
    if (shareUrl) window.open(shareUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="p-6" style={{ color: "var(--text-secondary)" }}>Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="container-premium pt-24 pb-12">
        <h1 className="text-2xl font-extrabold mb-4" style={{ color: "var(--text-primary)" }}>Refer & Earn</h1>
        <p style={{ color: "var(--text-secondary)" }}>Please log in to view your referral code and invite link.</p>
      </div>
    );
  }

  return (
    <div className="container-premium pt-24 pb-12" style={{ color: "var(--text-primary)" }}>
      <h1 className="text-2xl font-extrabold mb-4">Refer & Earn</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Invite friends to Litera. They get <strong>10% off</strong> their first purchase. After they successfully buy a course, you earn <strong>50 coins</strong>.
      </p>

      <div className="rounded-xl p-4 mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Your referral details</div>
          <button className="btn-premium px-3 py-2" onClick={refreshReferral}>Refresh</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Your Referral Code</div>
            <div className="flex items-center gap-2">
              <input className="input-premium flex-1 px-3 py-2" value={data?.referralCode || "Not available"} readOnly />
              <button className="btn-premium px-3 py-2" onClick={() => copyText(data?.referralCode || "")}>Copy</button>
            </div>
          </div>
          <div>
            <div className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Invite Link</div>
            <div className="flex items-center gap-2">
              <input className="input-premium flex-1 px-3 py-2" value={data?.inviteLink || "Not available"} readOnly />
              <button className="btn-premium px-3 py-2" onClick={() => copyText(data?.inviteLink || "")}>Copy</button>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="px-3 py-2 rounded-lg" style={{ background: "#25D366", color: "white" }} onClick={() => share("whatsapp")}>WhatsApp</button>
          <button className="px-3 py-2 rounded-lg" style={{ background: "#0088cc", color: "white" }} onClick={() => share("telegram")}>Telegram</button>
          <button className="px-3 py-2 rounded-lg" style={{ background: "#1877F2", color: "white" }} onClick={() => share("facebook")}>Facebook</button>
          <button className="px-3 py-2 rounded-lg" style={{ background: "#1DA1F2", color: "white" }} onClick={() => share("twitter")}>Twitter/X</button>
          <button className="px-3 py-2 rounded-lg" style={{ background: "#0A66C2", color: "white" }} onClick={() => share("linkedin")}>LinkedIn</button>
          <button className="px-3 py-2 rounded-lg" style={{ background: "var(--brand)", color: "white" }} onClick={() => share("email")}>Email</button>
          <button className="px-3 py-2 rounded-lg" style={{ background: "var(--brand)", color: "white" }} onClick={() => share("native")}>Share</button>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <h2 className="text-lg font-bold mb-3">How it Works</h2>
        <ul className="list-disc ml-6 space-y-2" style={{ color: "var(--text-secondary)" }}>
          <li>Share your referral link or code with friends.</li>
          <li>They sign up on Litera using your code or link.</li>
          <li>At checkout, they can apply a 10% referral discount.</li>
          <li>After their first successful course purchase, you receive 50 coins.</li>
          <li>Track your invites and rewards here.</li>
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="p-3 rounded-lg" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Total Invites</div>
            <div className="text-xl font-bold">{data?.stats?.totalInvites ?? 0}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Successful Purchases</div>
            <div className="text-xl font-bold">{data?.stats?.successfulPurchases ?? 0}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Total Coins Earned</div>
            <div className="text-xl font-bold">{data?.stats?.totalCoinsEarned ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}


