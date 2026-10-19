import { useState } from "react";
import { INBOX_POSTS } from "../data";
import { go, useStore } from "../store";
import { PlatformIcons } from "../components/Brand";
import { Icon } from "../components/Icon";

type Range = 7 | 30 | 90;
type Split = "both" | "fb" | "ig";

// Deterministic daily totals (likes + shares + comments) per platform, ending 18 Oct.
const DAYS = Array.from({ length: 90 }, (_, i) => {
  const wave = Math.sin(i / 2.3) * 18 + Math.sin(i / 5.1) * 10;
  return { fb: Math.round(38 + wave * 0.6 + (i % 7 === 5 ? 22 : 0)), ig: Math.round(52 + wave + (i % 4 === 1 ? 26 : 0) + i * 0.25) };
});
const END = new Date(2026, 9, 18);
const label = (back: number) => { const d = new Date(END); d.setDate(END.getDate() - back); return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };

const KPIS = [
  { key: "likes", label: "Likes", icon: "heart", base: 3482, delta: "+18%", fbShare: 0.36 },
  { key: "shares", label: "Shares", icon: "send", base: 412, delta: "+9%", fbShare: 0.71 },
  { key: "comments", label: "Comments", icon: "comment", base: 389, delta: "+31%", fbShare: 0.4 },
  { key: "reach", label: "Reach", icon: "globe", base: 48600, delta: "+12%", fbShare: 0.38 }
];
const fmt = (n: number) => n >= 10000 ? `${(n / 1000).toFixed(1)}k` : n.toLocaleString("en-GB");

// 13 · Engagement overview
export function Engagement() {
  const { design } = useStore();
  const [range, setRange] = useState<Range>(30);
  const [split, setSplit] = useState<Split>("both");
  const days = DAYS.slice(90 - range);
  const max = Math.max(...days.map((d) => (split !== "ig" ? d.fb : 0) + (split !== "fb" ? d.ig : 0)));
  const scale = range / 30;

  return (
    <div className="page">
      <header className="page-head">
        <div><span className="overline">MANAGE · LAST {range} DAYS</span><h1>Engagement</h1></div>
        <div className="row wrap">
          <div className="seg" role="group" aria-label="Date range">
            {([7, 30, 90] as Range[]).map((r) => <button key={r} className={range === r ? "on" : ""} aria-pressed={range === r} onClick={() => setRange(r)}>{r} days</button>)}
          </div>
          <div className="seg" role="group" aria-label="Platform">
            {(["both", "fb", "ig"] as Split[]).map((s) => <button key={s} className={split === s ? "on" : ""} aria-pressed={split === s} onClick={() => setSplit(s)}>{s === "both" ? "Both" : s === "fb" ? "Facebook" : "Instagram"}</button>)}
          </div>
        </div>
      </header>

      <section className="kpis">
        {KPIS.map((k) => {
          const total = k.base * scale;
          const value = split === "both" ? total : split === "fb" ? total * k.fbShare : total * (1 - k.fbShare);
          return (
            <div key={k.key} className="card kpi eng">
              <span className="kpi-head"><span className="kpi-ico violet"><Icon name={k.icon} size={17} /></span> {k.label}<span className="trend">↗ {k.delta}</span></span>
              <b className="eng-num">{fmt(Math.round(value))}</b>
              <span className="split-bar" role="img" aria-label={`Facebook ${Math.round(k.fbShare * 100)}%, Instagram ${Math.round((1 - k.fbShare) * 100)}%`}>
                {split !== "ig" && <i className="fb" style={{ flex: k.fbShare }} />}
                {split !== "fb" && <i className="ig" style={{ flex: 1 - k.fbShare }} />}
              </span>
            </div>
          );
        })}
      </section>

      <section className="card chart-card">
        <header className="card-head"><h2>Likes, shares &amp; comments per day</h2>
          <ul className="legend"><li className="l-fb">Facebook</li><li className="l-ig">Instagram</li></ul>
        </header>
        <div className={`stack-bars r${range}`} role="img" aria-label={`Daily engagement for the last ${range} days`}>
          {days.map((d, i) => (
            <div key={i} className="sb-col" title={`${label(range - 1 - i)}: Facebook ${d.fb}, Instagram ${d.ig}`}>
              {split !== "fb" && <i className="ig" style={{ height: `${(d.ig / max) * 100}%` }} />}
              {split !== "ig" && <i className="fb" style={{ height: `${(d.fb / max) * 100}%` }} />}
            </div>
          ))}
        </div>
        <div className="sb-axis"><span>{label(range - 1)}</span><span>{label(Math.floor(range / 2))}</span><span>Today</span></div>
      </section>

      <section className="card">
        <header className="card-head"><h2>Top posts</h2><a className="link" href="#/inbox">See all</a></header>
        <ol className="top-posts">
          {INBOX_POSTS.slice(0, 3).map((p, i) => (
            <li key={p.id}>
              <span className="rank">{i + 1}</span>
              <img src={design(p.designId).img} alt="" />
              <b>{p.title} <PlatformIcons platforms={p.platforms} size={14} /></b>
              <span><Icon name="heart" size={13} /> {p.likes}</span>
              <span><Icon name="send" size={13} /> {p.shares}</span>
              <span><Icon name="comment" size={13} /> {p.comments}</span>
              <span><Icon name="globe" size={13} /> {p.reach}</span>
              <button className="link" onClick={() => go("inbox")}>View comments <Icon name="arrowRight" size={13} /></button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
