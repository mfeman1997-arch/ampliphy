import { useEffect, useState } from "react";
import { TODAY, type LogLine, type Platform, type Post } from "../data";
import { fmtTime, go, parseDate, useStore } from "../store";
import { PlatformIcons } from "../components/Brand";
import { Icon } from "../components/Icon";
import { StatusPill } from "../components/StatusPill";
import { useToast } from "../components/Toasts";

type Entry = { key: string; post: Post; platforms: Platform[]; status: "published" | "failed" | "publishing" };
const stamp = () => new Date().toTimeString().slice(0, 8);
const dayHead = (d: string) => d === TODAY ? "TODAY" : parseDate(d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).toUpperCase().replace(",", "");
const inDays = (d: string, t: string) => {
  const hours = Math.round((parseDate(d).getTime() + Number(t.slice(0, 2)) * 36e5 - (parseDate(TODAY).getTime() + 9 * 36e5)) / 36e5);
  return hours < 24 ? `in ${hours}h` : `in ${Math.round(hours / 24)}d`;
};
const STATS: Record<string, { likes: number; comments: number; shares: number }> = {
  p8: { likes: 96, comments: 5, shares: 6 }, p7: { likes: 144, comments: 11, shares: 22 }, p6: { likes: 312, comments: 14, shares: 12 },
  p9: { likes: 18, comments: 2, shares: 1 }, p5: { likes: 201, comments: 8, shares: 9 }
};
const statsFor = (id: string) => STATS[id] ?? { likes: 120, comments: 6, shares: 4 };

// 11 · Activity · Publish timeline
export function Activity() {
  const { posts, setPosts, design } = useStore();
  const { notify } = useToast();
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [openLog, setOpenLog] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState(52);

  // The "publishing" post keeps sending while you watch.
  const sending = posts.some((p) => p.status === "publishing");
  useEffect(() => {
    if (!sending) return;
    if (progress >= 100) {
      setPosts((ps) => ps.map((p) => p.status === "publishing" ? { ...p, status: "published" } : p));
      notify("Morning routine is live on Facebook and Instagram");
      return;
    }
    const t = window.setTimeout(() => setProgress((p) => Math.min(100, p + 2)), 260);
    return () => window.clearTimeout(t);
  }, [progress, sending]);

  // A post sent to two platforms can succeed on one and fail on the other: one timeline entry per outcome.
  const entries: Entry[] = posts
    .filter((p) => ["published", "failed", "publishing"].includes(p.status) && p.date <= TODAY)
    .flatMap((p) => p.result
      ? (Object.entries(p.result) as [Platform, "published" | "failed"][]).map(([pl, r]) => ({ key: `${p.id}-${pl}`, post: p, platforms: [pl], status: r }))
      : [{ key: p.id, post: p, platforms: p.platforms, status: p.status as Entry["status"] }])
    .sort((a, b) => (b.post.date + b.post.time).localeCompare(a.post.date + a.post.time) || (a.status === "failed" ? -1 : 1))
    .slice(0, range === 7 ? 6 : 9);
  const days = [...new Set(entries.map((e) => e.post.date))];
  const live = posts.filter((p) => p.status === "published").length;
  const scheduled = posts.filter((p) => p.status === "scheduled");
  const publishing = posts.filter((p) => p.status === "publishing").length;
  const failed = entries.filter((e) => e.status === "failed").length;
  const coming = scheduled.filter((p) => p.date >= TODAY).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 4);
  const health = Math.round((25 / (25 + failed + publishing)) * 100);

  const addLog = (id: string, lines: LogLine[], patch: Partial<Post>) =>
    setPosts((ps) => ps.map((p) => p.id === id ? { ...p, ...patch, log: [...(p.log ?? []), ...lines] } : p));

  // Retrying the same 2:1 image fails again; only cropping fixes it.
  const retry = (p: Post, crop: boolean) => {
    setBusy(p.id); setOpenLog(`${p.id}-ig`);
    addLog(p.id, [{ t: stamp(), text: crop ? "Cropped to 4:5 · 1638×2048 PNG · retrying" : `Retry ${(p.attempts ?? 1) + 1} of 3 · same image` }], {});
    window.setTimeout(() => {
      if (crop) {
        addLog(p.id, [{ t: stamp(), text: "Instagram · Published · post 1801 2266", tone: "ok" }], { status: "published", result: { ...p.result, ig: "published" }, attempts: (p.attempts ?? 1) + 1 });
        notify("Rose Glow restock is live on Instagram");
      } else {
        addLog(p.id, [{ t: stamp(), text: "Error 36003 · Image aspect ratio not supported", tone: "error" }], { attempts: (p.attempts ?? 1) + 1 });
        notify("Instagram rejected the same image again. Crop to 4:5 to fix it");
      }
      setBusy(null);
    }, 1600);
  };

  return (
    <div className="page">
      <header className="page-head">
        <div><span className="overline live-tag"><i /> LIVE · UPDATED JUST NOW</span><h1>Publish activity</h1></div>
        <div className="seg" role="group" aria-label="Date range">
          {([7, 30, 90] as const).map((r) => <button key={r} className={range === r ? "on" : ""} aria-pressed={range === r} onClick={() => setRange(r)}>{r} days</button>)}
        </div>
      </header>

      <section className="stat-tiles">
        <div className="card tile"><span className="tile-ico green"><Icon name="checkCircle" size={20} /></span><span><b>{live}</b> Live<small>All went out on time</small></span></div>
        <a className="card tile" href="#/calendar"><span className="tile-ico violet"><Icon name="calendar" size={20} /></span><span><b>{scheduled.length}</b> Scheduled<small>Next one in 10h</small></span></a>
        <div className="card tile"><span className="tile-ico amber"><Icon name="sync" size={20} /></span><span><b>{publishing}</b> Publishing<small>{publishing ? "Sending right now" : "Nothing sending"}</small></span></div>
        <div className={`card tile ${failed ? "bad" : ""}`}><span className="tile-ico red"><Icon name="alert" size={20} /></span><span><b>{failed}</b> Failed<small className={failed ? "danger" : ""}>{failed ? "Needs a quick fix" : "All clear"}</small></span></div>
      </section>

      <div className="activity-grid">
        <section className="card timeline-card">
          <header className="card-head"><h2>Timeline</h2><span className="muted small">Newest first</span></header>
          <div className="timeline">
            {days.map((d) => (
              <div key={d} className="tl-day">
                <span className="tl-date">{dayHead(d)}</span>
                {entries.filter((e) => e.post.date === d).map((e) => {
                  const p = e.post;
                  const status = busy === p.id && e.status === "failed" ? "publishing" : e.status;
                  const st = statsFor(p.id);
                  return (
                    <div key={e.key} className={`tl-item t-${status}`}>
                      <span className="tl-time">{fmtTime(p.time)}</span>
                      <span className="tl-dot" aria-hidden="true" />
                      <article className={`tl-card ${status === "failed" ? "failed" : ""}`}>
                        <div className="tl-row">
                          <img src={design(p.designId).img} alt="" />
                          <span className="tl-body">
                            <b>{p.title} <PlatformIcons platforms={e.platforms} size={14} /></b>
                            <small className={status === "failed" ? "danger" : ""}>
                              {status === "failed" ? "Instagram doesn't accept 2:1 images. Use 4:5 up to 1.91:1."
                                : status === "publishing" ? (p.status === "publishing" ? "Live on Facebook · sending to Instagram" : "Sending the cropped image to Instagram")
                                : "Went live on time"}
                            </small>
                          </span>
                          <StatusPill status={status} />
                        </div>
                        {p.status === "publishing" && status === "publishing" && (
                          <div className="tl-progress"><div className="progress amber"><i style={{ width: `${progress}%` }} /></div><small>Instagram {progress < 100 ? "1" : "2"} of 2</small></div>
                        )}
                        {status === "failed" && (
                          <div className="tl-actions">
                            <button className="btn btn-grad sm" onClick={() => retry(p, true)}><Icon name="crop" size={14} /> Crop to 4:5 &amp; retry</button>
                            <button className="btn btn-white sm" onClick={() => retry(p, false)}><Icon name="retry" size={14} /> Retry as is</button>
                            <button className="link plain sm push" aria-expanded={openLog === e.key} onClick={() => setOpenLog(openLog === e.key ? null : e.key)}>Show log <Icon name="chevronDown" size={13} /></button>
                          </div>
                        )}
                        {openLog === e.key && p.log && (
                          <div className="terminal" aria-label="Publish log">
                            <b><Icon name="terminal" size={14} /> Publish log · Instagram · attempt {p.attempts ?? 1} of 3</b>
                            {p.log.map((l, i) => <div key={i} className={l.tone ?? ""}><span>{l.t}</span>{l.text}</div>)}
                          </div>
                        )}
                        {status === "published" && (
                          <div className="tl-stats">
                            <span className="chip sm"><Icon name="heart" size={12} /> {st.likes}</span>
                            <span className="chip sm"><Icon name="comment" size={12} /> {st.comments}</span>
                            <span className="chip sm"><Icon name="send" size={12} /> {st.shares}</span>
                            <button className="link sm push" onClick={() => go("inbox")}>View post <Icon name="external" size={12} /></button>
                          </div>
                        )}
                      </article>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        <div className="stack">
          <section className="card">
            <header className="card-head"><h2>Coming up</h2><a className="link" href="#/calendar">Calendar <Icon name="arrowRight" size={13} /></a></header>
            <ul className="coming">
              {coming.map((p, i) => (
                <li key={p.id}>
                  <img src={design(p.designId).img} alt="" />
                  <a href={`#/compose/${p.id}`}><b>{p.title}</b><small>{p.date === TODAY ? "Today" : parseDate(p.date).toLocaleDateString("en-GB", { weekday: "short" })} · {fmtTime(p.time)} <PlatformIcons platforms={p.platforms} size={12} /></small></a>
                  <span className={`when ${i === 0 ? "soon" : ""}`}>{inDays(p.date, p.time)}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="card health">
            <header className="card-head"><h2>Publish health</h2><span className="muted small">{range} days</span></header>
            <div className="health-body">
              <p><b>{health}%</b> went out on time</p>
              <div className="health-bar"><i className="g" style={{ flex: 25 }} /><i className="y" style={{ flex: publishing }} /><i className="r" style={{ flex: failed }} /></div>
              <ul className="health-legend"><li className="g">25 live</li><li className="y">{publishing} sending</li><li className="r">{failed} failed</li></ul>
              <p className="health-note"><Icon name="sparkle" size={14} /> The one miss this month was an image size. We now check sizes before you schedule.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
