// Demo data for Ampliphy (Lyon INC). Fictional brand "Rose Glow Skincare".
// The prototype's "today" is fixed so the calendar matches the Figma file.

export const TODAY = "2026-10-18";

export type Source = "Canva" | "Gamma";
export type Size = "1:1" | "4:5" | "9:16" | "2:1";
export type Platform = "fb" | "ig";
export type Status = "draft" | "scheduled" | "publishing" | "published" | "failed";

export type Design = { id: string; title: string; img: string; source: Source; size: Size; editedDaysAgo: number };

const img = (n: string) => `designs/${n}.jpg`;

export const DESIGNS: Design[] = [
  { id: "d1", title: "Weekend gift set", img: img("gift-set"), source: "Canva", size: "4:5", editedDaysAgo: 0 },
  { id: "d2", title: "Rose Glow restock", img: img("restock"), source: "Canva", size: "1:1", editedDaysAgo: 1 },
  { id: "d3", title: "Customer review", img: img("review"), source: "Canva", size: "4:5", editedDaysAgo: 1 },
  { id: "d4", title: "Face oil how-to", img: img("face-oil"), source: "Canva", size: "9:16", editedDaysAgo: 2 },
  { id: "d5", title: "Ingredient spotlight", img: img("ingredient"), source: "Gamma", size: "1:1", editedDaysAgo: 2 },
  { id: "d6", title: "Morning routine", img: img("morning"), source: "Canva", size: "4:5", editedDaysAgo: 3 },
  { id: "d7", title: "Sunday self-care", img: img("self-care"), source: "Canva", size: "1:1", editedDaysAgo: 4 },
  { id: "d8", title: "Serum launch teaser", img: img("serum"), source: "Gamma", size: "2:1", editedDaysAgo: 5 },
  { id: "d9", title: "Behind the scenes", img: img("behind"), source: "Canva", size: "4:5", editedDaysAgo: 6 },
  { id: "d10", title: "Autumn glow edit", img: img("autumn"), source: "Canva", size: "1:1", editedDaysAgo: 8 }
];

// Instagram feed accepts 4:5 to 1.91:1. A 2:1 design must be cropped first.
export const igReady = (s: Size) => s !== "2:1";

export type LogLine = { t: string; text: string; tone?: "error" | "ok" };
export type Post = {
  id: string;
  designId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  platforms: Platform[];
  status: Status;
  caption: string;
  hashtags: string[];
  result?: Partial<Record<Platform, "published" | "failed">>;
  attempts?: number;
  log?: LogLine[];
};

const cap = "Real words from real customers ✨ Swipe to see why Rose Glow serum keeps selling out. Which one's your favourite?";

export const INITIAL_POSTS: Post[] = [
  { id: "p1", designId: "d10", title: "Autumn glow edit", date: "2026-10-02", time: "12:00", platforms: ["ig"], status: "published", caption: cap, hashtags: ["#skincare"] },
  { id: "p2", designId: "d7", title: "Sunday self-care", date: "2026-10-06", time: "18:00", platforms: ["fb", "ig"], status: "published", caption: cap, hashtags: [] },
  { id: "p3", designId: "d5", title: "Ingredient spotlight", date: "2026-10-09", time: "19:00", platforms: ["ig"], status: "published", caption: cap, hashtags: [] },
  { id: "p4", designId: "d6", title: "Morning routine", date: "2026-10-13", time: "08:00", platforms: ["ig"], status: "published", caption: cap, hashtags: [] },
  { id: "p5", designId: "d4", title: "Face oil how-to", date: "2026-10-15", time: "12:00", platforms: ["fb"], status: "published", caption: cap, hashtags: [] },
  { id: "p6", designId: "d1", title: "Weekend gift set", date: "2026-10-16", time: "19:00", platforms: ["fb", "ig"], status: "published", caption: cap, hashtags: [] },
  { id: "p7", designId: "d5", title: "Ingredient spotlight", date: "2026-10-17", time: "12:00", platforms: ["fb"], status: "published", caption: cap, hashtags: [] },
  {
    id: "p8", designId: "d8", title: "Rose Glow restock", date: "2026-10-17", time: "21:00", platforms: ["fb", "ig"], status: "failed",
    caption: "Back in stock 🌹 Our best-seller is here again. Tap to shop before it goes.", hashtags: ["#roseglow"],
    result: { fb: "published", ig: "failed" }, attempts: 1,
    log: [
      { t: "21:00:01", text: "Media exported from Canva · 2048×1024 PNG" },
      { t: "21:00:02", text: "Sent to Instagram Graph API" },
      { t: "21:00:04", text: "Error 36003 · Image aspect ratio not supported", tone: "error" },
      { t: "21:00:04", text: "Facebook · Published · post 1029 4471", tone: "ok" }
    ]
  },
  { id: "p9", designId: "d6", title: "Morning routine", date: "2026-10-18", time: "09:00", platforms: ["fb", "ig"], status: "publishing", caption: cap, hashtags: [] },
  { id: "p10", designId: "d4", title: "Face oil how-to", date: "2026-10-18", time: "19:30", platforms: ["ig"], status: "scheduled", caption: "60 seconds to your best skin day. Here's how to use face oil the right way.", hashtags: ["#skincare", "#faceoil"] },
  { id: "p11", designId: "d3", title: "Customer review carousel", date: "2026-10-20", time: "18:00", platforms: ["fb", "ig"], status: "scheduled", caption: cap, hashtags: ["#skincare", "#skincareroutine"] },
  { id: "p12", designId: "d1", title: "Weekend gift set is back", date: "2026-10-23", time: "17:00", platforms: ["fb", "ig"], status: "scheduled", caption: cap, hashtags: [] },
  { id: "p13", designId: "d9", title: "Behind the scenes", date: "2026-10-24", time: "12:00", platforms: ["ig"], status: "scheduled", caption: cap, hashtags: [] },
  { id: "p14", designId: "d7", title: "Sunday self-care", date: "2026-10-29", time: "19:00", platforms: ["fb"], status: "scheduled", caption: cap, hashtags: [] },
  { id: "p15", designId: "d2", title: "Rose Glow restock", date: "2026-11-01", time: "11:00", platforms: ["ig"], status: "scheduled", caption: cap, hashtags: [] }
];

export const READY_TO_SCHEDULE = ["d1", "d3", "d6"];

export const PEOPLE = [
  { initials: "AR", name: "Aisha R.", color: "#e0457b" },
  { initials: "LM", name: "Lena M.", color: "#7c4dff" },
  { initials: "PN", name: "Priya N.", color: "#f59e0b" },
  { initials: "HC", name: "Hana C.", color: "#10b981" }
];

// ---- Engagement (screens 12–14) ----
export type Comment = { id: string; postId: string; person: string; platform: Platform; text: string; ago: string; replied?: string; worth?: boolean; liked?: boolean; hidden?: boolean };

export type InboxPost = { id: string; title: string; designId: string; platforms: Platform[]; published: string; likes: number; shares: number; comments: number; reach: string; split: { likes: [number, number]; shares: [number, number] }; reachNote: string };

export const INBOX_POSTS: InboxPost[] = [
  { id: "ip1", title: "Customer review carousel", designId: "d3", platforms: ["fb", "ig"], published: "Tue 13 Oct", likes: 486, shares: 41, comments: 23, reach: "6.2k", split: { likes: [172, 314], shares: [33, 8] }, reachNote: "+24% vs avg" },
  { id: "ip2", title: "Face oil how-to", designId: "d4", platforms: ["ig"], published: "Thu 15 Oct", likes: 312, shares: 12, comments: 14, reach: "4.1k", split: { likes: [0, 312], shares: [0, 12] }, reachNote: "+9% vs avg" },
  { id: "ip3", title: "Sunday self-care", designId: "d9", platforms: ["ig"], published: "Tue 6 Oct", likes: 201, shares: 9, comments: 8, reach: "2.9k", split: { likes: [0, 201], shares: [0, 9] }, reachNote: "−6% vs avg" },
  { id: "ip4", title: "Ingredient spotlight", designId: "d5", platforms: ["fb"], published: "Sat 17 Oct", likes: 144, shares: 22, comments: 11, reach: "2.4k", split: { likes: [144, 0], shares: [22, 0] }, reachNote: "+2% vs avg" },
  { id: "ip5", title: "Rose Glow restock", designId: "d2", platforms: ["fb"], published: "Sat 17 Oct", likes: 96, shares: 6, comments: 5, reach: "1.8k", split: { likes: [96, 0], shares: [6, 0] }, reachNote: "−12% vs avg" },
  { id: "ip6", title: "Autumn glow edit", designId: "d10", platforms: ["ig"], published: "Fri 2 Oct", likes: 228, shares: 14, comments: 12, reach: "3.3k", split: { likes: [0, 228], shares: [0, 14] }, reachNote: "+4% vs avg" }
];

export const COMMENTS: Comment[] = [
  { id: "c1", postId: "ip1", person: "aisha", platform: "ig", text: "Is the gift set back in stock? I missed it last time 😭 How much is it?", ago: "2h", worth: true },
  { id: "c2", postId: "ip1", person: "leo", platform: "fb", text: "Bought this for my sister and she loved it. Do you ship to Ireland?", ago: "3h" },
  { id: "c3", postId: "ip1", person: "priya", platform: "ig", text: "The texture looks amazing 😍", ago: "5h", replied: "Thank you Priya! Glad you love it 💜" },
  { id: "c4", postId: "ip1", person: "hannah", platform: "fb", text: "Is it OK for sensitive skin?", ago: "1d" },
  { id: "c5", postId: "ip2", person: "zara", platform: "ig", text: "Saving this! Do I use it before or after moisturiser?", ago: "4h" },
  { id: "c6", postId: "ip2", person: "leo", platform: "ig", text: "Smells incredible in person.", ago: "1d", replied: "So happy you tried it, Leo!" },
  { id: "c7", postId: "ip4", person: "hannah", platform: "fb", text: "Which one has the vitamin C?", ago: "6h" },
  { id: "c8", postId: "ip4", person: "priya", platform: "fb", text: "Love these ingredient breakdowns.", ago: "1d", replied: "More coming every Saturday!" }
];

export const REPLY_SUGGESTIONS: Record<string, string> = {
  c1: "Yes, it's back! It's £38 and ships free this week. I'll send you a DM with the link 💜",
  c2: "So glad she loved it! Yes, we ship to Ireland, usually in 3–5 days 🇮🇪",
  c4: "Great question! It's fragrance-free and dermatologist tested, so it suits most sensitive skin. Patch test first to be sure 💜",
  c5: "After cleansing and before moisturiser, 2–3 drops pressed into the skin ✨",
  c7: "That's our Glow Serum, with 15% vitamin C. Link in bio 🍊"
};

export type Person = { id: string; name: string; initials: string; color: string; handle: string; platform: Platform; since: string; heat: "hot" | "warm" | "new"; summary: string; ago: string; why: string[]; recent: { quote: string; where: string; when: string; designId: string }; messages: Record<"friendly" | "helpful" | "offer", string> };

export const PEOPLE_LIST: Person[] = [
  {
    id: "aisha", name: "Aisha Rahman", initials: "AR", color: "#e0457b", handle: "@aisha.glows", platform: "ig", since: "Mar 2025", heat: "hot", summary: "Asked about the gift set price twice", ago: "2h",
    why: ["Asked about the gift set price twice (13 and 17 Oct)", "Commented on 3 posts and shared 1 this month", "The gift set restock goes live on Friday"],
    recent: { quote: "Is the gift set back in stock? I missed it last time 😭 How much is it?", where: "Comment · Customer review carousel", when: "2h ago", designId: "d3" },
    messages: {
      friendly: "Hi Aisha! Thanks so much for all the love on our posts 💜 Good news: the weekend gift set is back on Friday. It's £38 and ships free this week. Want me to save one for you?",
      helpful: "Hi Aisha, you asked about the gift set price. It's £38 and includes the serum, cleanser and face oil. It's back in stock Friday, and I can send you the link the moment it's live.",
      offer: "Hi Aisha! As one of our most engaged followers, here's 10% off the gift set when it's back on Friday: code GLOWAISHA. It's £38 before the discount, with free shipping this week 💜"
    }
  },
  {
    id: "leo", name: "Leo Martins", initials: "LM", color: "#7c4dff", handle: "Leo Martins", platform: "fb", since: "Jun 2025", heat: "hot", summary: "Asked if you ship to Ireland, bought before", ago: "3h",
    why: ["Bought the gift set in August", "Asked about shipping to Ireland on Customer review carousel", "Has tagged 2 friends in comments"],
    recent: { quote: "Bought this for my sister and she loved it. Do you ship to Ireland?", where: "Comment · Customer review carousel", when: "3h ago", designId: "d3" },
    messages: {
      friendly: "Hi Leo! So glad your sister loved it 💜 Yes, we ship to Ireland, usually in 3–5 days. Anything you'd like me to check for you?",
      helpful: "Hi Leo, we ship to Ireland in 3–5 working days, and shipping is free over £40. Happy to send a link if you want to order again.",
      offer: "Hi Leo! Thanks for coming back. Here's free shipping to Ireland on your next order with code IRELANDGLOW, valid until Sunday."
    }
  },
  {
    id: "priya", name: "Priya Nair", initials: "PN", color: "#f59e0b", handle: "@priya.n", platform: "ig", since: "Jan 2026", heat: "warm", summary: "Engages with every reel this month", ago: "5h",
    why: ["Liked or commented on all 6 reels this month", "Saved the face oil how-to", "Hasn't bought yet"],
    recent: { quote: "The texture looks amazing 😍", where: "Comment · Customer review carousel", when: "5h ago", designId: "d3" },
    messages: {
      friendly: "Hi Priya! You've been such a lovely part of our comments this month 💜 Is there a product you've been curious to try?",
      helpful: "Hi Priya, since you saved the face oil how-to: it's best used after cleansing, 2–3 drops. Happy to answer any questions before you try it.",
      offer: "Hi Priya! Here's 10% off your first order as a thank-you for all the support: code PRIYAGLOW 💜"
    }
  },
  {
    id: "hannah", name: "Hannah Cole", initials: "HC", color: "#10b981", handle: "Hannah Cole", platform: "fb", since: "Sep 2025", heat: "warm", summary: "Asked if it suits sensitive skin, not answered yet", ago: "1d",
    why: ["Asked a buying question that is still unanswered", "Commented on 2 posts this month"],
    recent: { quote: "Is it OK for sensitive skin?", where: "Comment · Customer review carousel", when: "1d ago", designId: "d3" },
    messages: {
      friendly: "Hi Hannah! Sorry for the slow reply. Yes, it's fragrance-free and gentle on sensitive skin 💜 Want me to suggest where to start?",
      helpful: "Hi Hannah, the serum is fragrance-free and dermatologist tested. For sensitive skin we suggest a patch test, then using it every other day for the first week.",
      offer: "Hi Hannah! Our travel-size serum is a low-risk way to try it on sensitive skin. Here's 15% off with code GENTLE15."
    }
  },
  {
    id: "zara", name: "Zara Ahmed", initials: "ZA", color: "#ec4899", handle: "@zara.creates", platform: "ig", since: "Oct 2026", heat: "new", summary: "Shared 2 posts with her 8.4k followers", ago: "2d",
    why: ["Shared 2 posts to her stories this week", "Has 8.4k followers in skincare", "Followed you 5 days ago"],
    recent: { quote: "Saving this! Do I use it before or after moisturiser?", where: "Comment · Face oil how-to", when: "4h ago", designId: "d4" },
    messages: {
      friendly: "Hi Zara! Thank you for sharing our posts, it means a lot 💜 Would you like to try the new serum before it launches?",
      helpful: "Hi Zara, to answer your question: use the face oil after cleansing and before moisturiser. Thanks for sharing us with your followers!",
      offer: "Hi Zara! We'd love to send you our launch kit as a thank-you for the shares. No strings attached. Can I get your address?"
    }
  }
];

export const SUGGESTED_TAGS = ["#selfcare", "#skincareroutine", "#glowingskin"];

// Caption helpers shown as suggestions. The user always sees a before/after and chooses.
export const CAPTION_VARIANTS = {
  rewrite: "Our customers said it best ✨ Swipe through real reviews and see why Rose Glow serum keeps selling out. Which one would you pick?",
  shorter: "Real reviews, real glow ✨ Which one's your favourite?",
  emoji: "Real words from real customers ✨💬 Swipe to see why Rose Glow serum keeps selling out 🌹 Which one's your favourite? 👇"
};

export const BEST_TIMES: Record<number, string> = { 0: "11:00", 1: "18:00", 2: "18:00", 3: "19:30", 4: "19:30", 5: "17:00", 6: "12:00" };
