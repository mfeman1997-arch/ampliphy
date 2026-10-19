import { useEffect, useState } from "react";
import { BEST_TIMES, CAPTION_VARIANTS, TODAY, igReady, type Platform } from "../data";
import { fmtDay, fmtTime, go, parseDate, useStore } from "../store";
import { Facebook, Instagram } from "../components/Brand";
import { Icon } from "../components/Icon";
import { useToast } from "../components/Toasts";

type Mode = "both" | "fb" | "ig";
type Variant = keyof typeof CAPTION_VARIANTS;
const IG_LIMIT = 2200;
// "19:30" → "7–9 PM": the hour window around the best time, as the design phrases it.
const fmtWindow = (t: string) => {
  const h = Number(t.slice(0, 2));
  const h12 = (x: number) => ((x + 11) % 12) + 1;
  return `${h12(h)}–${h12(h + 2)} ${h + 2 < 12 ? "AM" : "PM"}`;
};
const TIMES = Array.from({ length: 30 }, (_, i) => { const h = 7 + Math.floor(i / 2); return `${String(h).padStart(2, "0")}:${i % 2 ? "30" : "00"}`; });

// 10 · Compose · Caption & hashtags
export function Compose({ postId }: { postId?: string }) {
  const { posts, setPosts, design } = useStore();
  const { notify } = useToast();
  const post = posts.find((p) => p.id === postId);

  const [designId, setDesignId] = useState(post?.designId ?? "d3");
  const [platforms, setPlatforms] = useState<Platform[]>(post?.platforms ?? ["fb", "ig"]);
  const [mode, setMode] = useState<Mode>("both");
  const [captions, setCaptions] = useState<Record<Mode, string>>({ both: post?.caption ?? "", fb: post?.caption ?? "", ig: post?.caption ?? "" });
  const [tags, setTags] = useState<string[]>(post?.hashtags.length ? post.hashtags : ["#skincare", "#roseglow", "#glowup", "#serum"]);
  const [date, setDate] = useState(post?.date ?? "2026-10-22");
  const [time, setTime] = useState(post?.time ?? "19:30");
  const [preview, setPreview] = useState<Platform>("ig");
  const [proposal, setProposal] = useState<Variant | null>(null);
  const [tried, setTried] = useState(false);

  useEffect(() => { if (!post) go("calendar"); }, [post]);
  if (!post) return null;

  const d = design(designId);
  const caption = captions[mode];
  const setCaption = (v: string) => setCaptions((c) => ({ ...c, [mode]: v }));
  const captionFor = (p: Platform) => (mode === "both" ? captions.both : captions[p]);
  const needsCrop = platforms.includes("ig") && !igReady(d.size);
  const weekday = parseDate(date).getDay();
  const best = BEST_TIMES[weekday];
  const dayName = parseDate(date).toLocaleDateString("en-GB", { weekday: "long" });

  const problems: string[] = [];
  if (!platforms.length) problems.push("Choose at least one place to post.");
  if (platforms.some((p) => !captionFor(p).trim())) problems.push("Write a caption for each selected platform.");
  if (date < TODAY) problems.push("Pick a date from today onwards.");
  if (needsCrop) problems.push("This design is 2:1. Instagram needs 4:5 to 1.91:1.");
  if (captionFor("ig").length > IG_LIMIT) problems.push("Instagram captions are limited to 2,200 characters.");

  const save = (status: "draft" | "scheduled") => {
    if (status === "scheduled") { setTried(true); if (problems.length) return; }
    const before = posts.find((p) => p.id === post.id)!;
    setPosts((ps) => ps.map((p) => p.id === post.id ? { ...p, designId, title: d.title, platforms, caption: captionFor(platforms[0] ?? "ig"), hashtags: tags, date, time, status } : p));
    notify(status === "scheduled" ? `Scheduled for ${fmtDay(date)}, ${fmtTime(time)}` : "Draft saved", () => setPosts((ps) => ps.map((p) => p.id === post.id ? before : p)));
    go("calendar");
  };

  const togglePlatform = (p: Platform) => setPlatforms((cur) => cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]);

  return (
    <div className="page">
      <header className="page-head">
        <div><a className="link back sm" href="#/calendar"><Icon name="chevronLeft" size={14} /> Back to calendar</a><h1>Schedule post</h1></div>
        <div className="row">
          <button className="btn btn-white" onClick={() => save("draft")}>Save draft</button>
          <button className="btn btn-grad" onClick={() => save("scheduled")}><Icon name="calendar" size={16} /> Schedule · {fmtDay(date)}, {fmtTime(time)}</button>
        </div>
      </header>

      {tried && problems.length > 0 && (
        <div className="alert" role="alert"><Icon name="alert" size={18} /><div><b>Fix {problems.length === 1 ? "this" : "these"} before scheduling</b><ul>{problems.map((p) => <li key={p}>{p}</li>)}</ul></div></div>
      )}

      <div className="compose">
        <section className="card preview-card" aria-label="Preview">
          <header className="card-head"><h2>Preview</h2>
            <div className="seg sm" role="tablist">
              <button role="tab" aria-selected={preview === "ig"} className={preview === "ig" ? "on" : ""} onClick={() => setPreview("ig")}><Instagram size={15} /> Instagram</button>
              <button role="tab" aria-selected={preview === "fb"} className={preview === "fb" ? "on" : ""} onClick={() => setPreview("fb")}><Facebook size={15} /> Facebook</button>
            </div>
          </header>
          <article className={`phone-post ${preview}`}>
            <header><img src="designs/restock.jpg" alt="" /><b>{preview === "ig" ? "roseglow.co" : "Rose Glow Skincare"}</b><Icon name="more" size={18} /></header>
            <div className={`post-media ${needsCrop && preview === "ig" ? "bad-crop" : ""}`}><img src={d.img} alt={d.title} /></div>
            <div className="post-actions"><Icon name="heart" /><Icon name="comment" /><Icon name="send" /><span /><Icon name="bookmark" /></div>
            <p className="post-caption"><b>{preview === "ig" ? "roseglow.co" : ""}</b> {captionFor(preview) || <span className="muted">Your caption will appear here</span>} <span className="tags">{tags.join(" ")}</span></p>
            {!platforms.includes(preview) && <div className="not-posting">Not posting to {preview === "ig" ? "Instagram" : "Facebook"}</div>}
          </article>
        </section>

        <section className="card form-card">
          {needsCrop && (
            <div className="warn-box"><Icon name="crop" size={16} /> Instagram won't accept a 2:1 image. <button className="link" onClick={() => setDesignId("d3")}>Use a 4:5 design</button> or turn off Instagram.</div>
          )}

          <fieldset className="block">
            <legend>Post to</legend>
            <div className="post-to">
              <label className={platforms.includes("fb") ? "on" : ""}><Facebook size={30} /><span><b>Facebook</b><small>Rose Glow Skincare</small></span><input type="checkbox" checked={platforms.includes("fb")} onChange={() => togglePlatform("fb")} /><i className="check" /></label>
              <label className={platforms.includes("ig") ? "on" : ""}><Instagram size={30} /><span><b>Instagram</b><small>@roseglow.co</small></span><input type="checkbox" checked={platforms.includes("ig")} onChange={() => togglePlatform("ig")} /><i className="check" /></label>
            </div>
          </fieldset>

          <fieldset className="block">
            <legend className="legend-row">Caption
              <span className="chips">
                {(["both", "fb", "ig"] as Mode[]).map((m) => <button type="button" key={m} className={`chip sm ${mode === m ? "dark" : ""}`} aria-pressed={mode === m} onClick={() => { setMode(m); setProposal(null); if (m !== "both" && !captions[m]) setCaptions((c) => ({ ...c, [m]: c.both })); }}>{m === "both" ? "Same for both" : m === "fb" ? "Facebook only" : "Instagram only"}</button>)}
              </span>
            </legend>
            {proposal ? (
              <div className="caption-diff" aria-live="polite">
                <p className="del"><s>{caption}</s></p>
                <p className="ins">{CAPTION_VARIANTS[proposal]}</p>
                <div className="row">
                  <button className="btn btn-grad sm" onClick={() => { const prev = caption; setCaption(CAPTION_VARIANTS[proposal]); setProposal(null); notify("Caption updated", () => setCaption(prev)); }}><Icon name="check" size={14} /> Use this</button>
                  <button className="btn btn-white sm" onClick={() => setProposal(null)}>Keep mine</button>
                </div>
              </div>
            ) : (
              <div className="caption-box">
                <textarea rows={4} value={caption} onChange={(e) => setCaption(e.target.value)} aria-label="Caption" placeholder="Write a caption…" />
                <div className="caption-tools">
                  <button type="button" className="chip sm soft" onClick={() => setProposal("rewrite")} disabled={!caption.trim()}><Icon name="sparkle" size={13} /> Rewrite</button>
                  <span className={`count ${caption.length > IG_LIMIT ? "over" : ""}`}>{caption.length} / {IG_LIMIT.toLocaleString()}</span>
                </div>
              </div>
            )}
          </fieldset>

          <fieldset className="block">
            <legend>Hashtags <small>{tags.length} of 30</small></legend>
            <div className="chips">
              {tags.map((t) => <span key={t} className="tag">{t}<button aria-label={`Remove ${t}`} onClick={() => setTags(tags.filter((x) => x !== t))}><Icon name="x" size={12} /></button></span>)}
            </div>
          </fieldset>

          <fieldset className="block">
            <legend>When</legend>
            <div className="when">
              <label className="select"><Icon name="calendar" size={16} /><input type="date" value={date} min={TODAY} onChange={(e) => setDate(e.target.value)} aria-label="Date" /></label>
              <label className="select"><Icon name="clock" size={16} /><select value={time} onChange={(e) => setTime(e.target.value)} aria-label="Time">{TIMES.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}</select></label>
            </div>
            <div className="best-hint">
              <Icon name="sparkle" size={14} />
              {time === best ? <span>Good pick: your followers are most active {dayName}s {fmtWindow(best)}.</span>
                : <span>Your followers are most active {dayName}s {fmtWindow(best)}. <button className="link" onClick={() => setTime(best)}>Use {fmtTime(best)}</button></span>}
            </div>
          </fieldset>
        </section>
      </div>
    </div>
  );
}
