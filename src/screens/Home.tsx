import { PEOPLE, TODAY } from "../data";
import { fmtDay, fmtTime, go, parseDate, useStore } from "../store";
import { Avatar, PlatformIcons } from "../components/Brand";
import { Icon } from "../components/Icon";
import { StatusPill } from "../components/StatusPill";

const dayLabel = (date: string) => (date === TODAY ? "Today" : fmtDay(date));
const WEEK_BARS = [38, 52, 46, 61, 55, 78, 92];

// 07 · Home
export function Home() {
  const { posts, design, comments } = useStore();
  const scheduled = posts.filter((p) => p.date.startsWith("2026-10") && p.status === "scheduled");
  const failed = posts.filter((p) => p.status === "failed");
  const upcoming = posts.filter((p) => p.status === "failed" || (p.date >= TODAY && ["scheduled", "draft"].includes(p.status)))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 4);
  const next = scheduled.filter((p) => p.date >= TODAY).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
  const waiting = comments.filter((c) => !c.replied && !c.hidden).length;

  return (
    <div className="page home">
      <header className="page-head">
        <div>
          <span className="overline">{parseDate(TODAY).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }).toUpperCase().replace(" ", ", ")}</span>
          <h1>Good morning, Emma</h1>
        </div>
        <button className="btn btn-grad" onClick={() => go("calendar")}><Icon name="calendar" size={16} /> Plan this month</button>
      </header>

      <section className="kpis three">
        <a className="card kpi" href="#/calendar">
          <span className="kpi-head"><span className="kpi-ico violet"><Icon name="calendar" size={17} /></span> Scheduled this month</span>
          <span className="kpi-row"><b>{scheduled.length}</b><small>{next ? `Next: ${dayLabel(next.date).toLowerCase()}, ${fmtTime(next.time)}` : "Nothing queued"}</small></span>
        </a>
        <a className={`card kpi ${failed.length ? "attention" : ""}`} href="#/activity">
          <span className="kpi-head"><span className="kpi-ico red"><Icon name="alert" size={17} /></span> Needs attention</span>
          <span className="kpi-row"><b>{failed.length}</b><small className={failed.length ? "danger" : ""}>{failed.length ? "Instagram post failed · Retry" : "All clear"}</small></span>
        </a>
        <a className="card kpi" href="#/inbox">
          <span className="kpi-head"><span className="kpi-ico pink"><Icon name="comment" size={17} /></span> New comments</span>
          <span className="kpi-row"><b>23</b><small>{waiting} waiting for a reply</small></span>
        </a>
      </section>

      <div className="home-grid">
        <section className="card">
          <header className="card-head"><h2>Up next <small>this week</small></h2><a className="link" href="#/calendar">Open calendar <Icon name="arrowRight" size={14} /></a></header>
          <ul className="upnext">
            {upcoming.map((p) => (
              <li key={p.id}>
                <img src={design(p.designId).img} alt="" />
                <a href={p.status === "failed" ? "#/activity" : `#/compose/${p.id}`}><b>{p.title}</b><small>{dayLabel(p.date)} · {fmtTime(p.time)}{p.status === "failed" ? " · needs retry" : ""}</small></a>
                <PlatformIcons platforms={p.platforms} />
                <StatusPill status={p.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="card talk">
          <span className="chip-glass"><Icon name="sparkle" size={13} /> Who to talk to · 5 new</span>
          <h2>Aisha asked about the gift set price twice this week</h2>
          <p>She commented on 3 posts and shared one. A quick DM could turn that into an order.</p>
          <div className="avatars">{PEOPLE.map((p) => <Avatar key={p.initials} {...p} size={38} />)}</div>
          <a className="btn btn-white" href="#/people">See who to talk to <Icon name="arrowRight" size={15} /></a>
          <span className="talk-glow" aria-hidden="true" />
        </section>

        <section className="card this-week">
          <header className="card-head"><h2>This week <small>Facebook + Instagram</small></h2></header>
          <div className="tw-body">
            <dl className="tw-stats">
              <div><dt>Likes</dt><dd><b>1,284</b><span className="up">+18%</span></dd></div>
              <div><dt>Comments</dt><dd><b>146</b><span className="up">+31%</span></dd></div>
              <div><dt>Reach</dt><dd><b>18.2k</b><span className="up">+12%</span></dd></div>
            </dl>
            <div className="tw-bars" role="img" aria-label="Engagement by day this week, highest on Sunday">
              {WEEK_BARS.map((v, i) => <span key={i} className={i === 6 ? "today" : ""}><i style={{ height: `${v}%` }} /><small>{"MTWTFSS"[i]}</small></span>)}
            </div>
            <a className="link" href="#/engagement">Details <Icon name="arrowRight" size={14} /></a>
          </div>
        </section>

        <section className="card">
          <header className="card-head"><h2>Recent activity</h2><a className="link" href="#/activity">View log</a></header>
          <ul className="mini-log">
            <li><i className="g" /> <span>Morning routine is live on Facebook &amp; Instagram</span><small>9:02 AM</small></li>
            <li><i className="p" /> <span>Aisha commented on Customer review</span><small>2h ago</small></li>
            <li><i className="r" /> <span>Rose Glow restock failed on Instagram</span><small>Sat</small></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
