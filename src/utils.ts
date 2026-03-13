export const calculatePrice = (basePrice: number) => {
  let markup = 0;
  if (basePrice < 50000) {
    markup = 0.3;
  } else if (basePrice <= 200000) {
    markup = 0.2;
  } else {
    markup = 0.15;
  }
  
  const finalPrice = Math.round(basePrice * (1 + markup) / 1000) * 1000;
  const usdtPrice = (finalPrice / 25000).toFixed(2);
  
  return { vnd: finalPrice, usdt: usdtPrice };
};

export const categorizeProduct = (keywords: string) => {
  const kw = keywords.toLowerCase();
  if (kw.includes("chatgpt") || kw.includes("veo3") || kw.includes("grok") || kw.includes("gemini") || kw.includes("perplexity") || kw.includes("ai tools")) {
    return "AI Tools";
  }
  if (kw.includes("netflix") || kw.includes("youtube") || kw.includes("entertainment")) {
    return "Entertainment";
  }
  if (kw.includes("hma") || kw.includes("nord") || kw.includes("surfshark") || kw.includes("express") || kw.includes("proxy") || kw.includes("vpn")) {
    return "VPN & Proxy";
  }
  if (kw.includes("capcut") || kw.includes("canva") || kw.includes("adobe") || kw.includes("meitu") || kw.includes("xingtu") || kw.includes("design") || kw.includes("video")) {
    return "Design & Video";
  }
  if (kw.includes("via") || kw.includes("clone") || kw.includes("bm") || kw.includes("page") || kw.includes("tài khoản facebook") || kw.includes("facebook")) {
    return "Facebook";
  }
  if (kw.includes("traodoisub") || kw.includes("zalo") || kw.includes("tiktok") || kw.includes("gpm") || kw.includes("marketing") || kw.includes("social")) {
    return "Marketing & Social";
  }
  return "Other";
};
