import { useMemo, useState, type DragEvent } from "react";
import { BEST_TIMES, TODAY, type Platform, type Post } from "../data";
import { fmtDay, fmtShortTime, fmtTime, go, parseDate, toKey, useStore } from "../store";
import { PlatformIcons } from "../components/Brand";
import { Icon } from "../components/Icon";
import { StatusPill } from "../components/StatusPill";
import { useToast } from "../components/Toasts";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(1 - ((first.getDay() + 6) % 7)); // back to Monday
  const last = new Date(year, month + 1, 0);
  const weeks = Math.ceil((((first.getDay() + 6) % 7) + last.getDate()) / 7);
  return Array.from({ length: weeks * 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
}

let nextId = 100;

// 09 · Calendar · Month drag & drop
export function Calendar() {
  const { posts, setPosts, ready, setReady, design } = useStore();
  const { notify } = useToast();
  const [cursor, setCursor] = useState({ y: 2026, m: 9 });
  const [view, setView] = useState<"month" | "week" | "list">("month");
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [placing, setPlacing] = useState<string | null>(null); // design id chosen for click-to-place
  const [over, setOver] = useState<string | null>(null);

  const days = useMemo(() => monthGrid(cursor.y, cursor.m), [cursor]);
  const visible = (p: Post) => platform === "all" || p.platforms.includes(platform);
  const byDay = useMemo(() => {
    const map: Record<string, Post[]> = {};
    posts.filter(visible).forEach((p) => { (map[p.date] ??= []).push(p); });
    Object.values(map).forEach((l) => l.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [posts, platform]);
  const monthLabel = new Date(cursor.y, cursor.m, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const monthPosts = posts.filter((p) => p.date.startsWith(`${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`));

  const placeDesign = (designId: string, date: string) => {
    const d = design(designId);
    const id = `p${nextId++}`;
    const time = BEST_TIMES[parseDate(date).getDay()];
    setPosts((ps) => [...ps, { id, designId, title: d.title, date, time, platforms: ["fb", "ig"], status: "draft", caption: "", hashtags: [] }]);
    setReady((r) => r.filter((x) => x !== designId));
    setPlacing(null);
    go("compose", id);
  };

  const movePost = (id: string, date: string) => {
    const before = posts.find((p) => p.id === id);
    if (!before || before.date === date) return;
    setPosts((ps) => ps.map((p) => p.id === id ? { ...p, date } : p));
    notify(`Moved “${before.title}” to ${fmtDay(date)}`, () => setPosts((ps) => ps.map((p) => p.id === id ? { ...p, date: before.date } : p)));
  };

  const onDrop = (e: DragEvent, date: string) => {
    e.preventDefault(); setOver(null);
    const [kind, id] = e.dataTransfer.getData("text/plain").split(":");
    if (kind === "design") placeDesign(id, date);
    if (kind === "post") movePost(id, date);
  };

  const weekRow = days.findIndex((d) => toKey(d) === TODAY);
  const shownDays = view === "week" && weekRow >= 0 ? days.slice(Math.floor(weekRow / 7) * 7, Math.floor(weekRow / 7) * 7 + 7) : days;

  return (
    <div className="page">
      <header className="page-head">
        <div><span className="overline">PLAN · {monthPosts.length} POSTS THIS MONTH</span><h1>Calendar</h1></div>
        <div className="row wrap">
          <div className="seg" role="group" aria-label="View">
            {(["month", "week", "list"] as const).map((v) => <button key={v} className={view === v ? "on" : ""} aria-pressed={view === v} onClick={() => setView(v)}>{v[0].toUpperCase() + v.slice(1)}</button>)}
          </div>
          <div className="month-nav">
            <button className="icon-btn" aria-label="Previous month" onClick={() => setCursor((c) => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 })}><Icon name="chevronLeft" size={16} /></button>
            <b>{monthLabel}</b>
            <button className="icon-btn" aria-label="Next month" onClick={() => setCursor((c) => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 })}><Icon name="chevronRight" size={16} /></button>
          </div>
        </div>
      </header>

      <div className="toolbar between">
        <div className="chips" role="group" aria-label="Platform">
          {(["all", "fb", "ig"] as const).map((p) => (
            <button key={p} className={`chip ${platform === p ? "dark" : ""}`} aria-pressed={platform === p} onClick={() => setPlatform(p)}>
              {p === "all" ? "All platforms" : <><PlatformIcons platforms={[p]} size={14} /> {p === "fb" ? "Facebook" : "Instagram"}</>}
            </button>
          ))}
        </div>
        <ul className="legend"><li className="l-scheduled">Scheduled</li><li className="l-published">Published</li><li className="l-failed">Failed</li><li className="l-draft">Draft</li></ul>
      </div>

      <div className="cal-layout">
        <aside className="card ready">
          <header className="card-head"><h2>Ready to schedule</h2><span className="count-badge">{ready.length}</span></header>
          <ul>
            {ready.map((id) => {
              const d = design(id);
              return (
                <li key={id}>
                  <button
                    className={`ready-item ${placing === id ? "on" : ""}`}
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData("text/plain", `design:${id}`); e.dataTransfer.effectAllowed = "copy"; }}
                    onClick={() => setPlacing(placing === id ? null : id)}
                    aria-pressed={placing === id}
                  >
                    <Icon name="drag" size={16} className="grip" />
                    <img src={d.img} alt="" />
                    <span><b>{d.title}</b><small>{d.source} · {d.size}</small></span>
                  </button>
                </li>
              );
            })}
          </ul>
          <a className="add-designs" href="#/designs"><Icon name="plus" size={15} /> Add from Designs</a>
        </aside>

        {view === "list" ? (
          <section className="card cal-list">
            {Object.keys(byDay).filter((k) => k.startsWith(`${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`)).sort().map((k) => (
              <div key={k} className="list-day">
                <h3>{fmtDay(k)}{k === TODAY && <span className="today-tag">Today</span>}</h3>
                {byDay[k].map((p) => (
                  <a key={p.id} className="list-post" href={p.status === "failed" ? "#/activity" : `#/compose/${p.id}`}>
                    <img src={design(p.designId).img} alt="" /><span><b>{p.title}</b><small>{fmtTime(p.time)}</small></span>
                    <PlatformIcons platforms={p.platforms} /><StatusPill status={p.status} />
                  </a>
                ))}
              </div>
            ))}
          </section>
        ) : (
          <section className={`cal ${placing ? "placing" : ""}`} aria-label={`${monthLabel} calendar`}>
            {placing && <div className="placing-banner" role="status"><Icon name="info" size={15} /> Click a day to place “{design(placing).title}”. <button className="link" onClick={() => setPlacing(null)}>Cancel</button></div>}
            <div className="cal-head">{WEEKDAYS.map((w) => <span key={w}>{w}</span>)}</div>
            <div className="cal-grid">
              {shownDays.map((d) => {
                const key = toKey(d);
                const inMonth = d.getMonth() === cursor.m;
                const past = key < TODAY;
                const list = byDay[key] ?? [];
                return (
                  <div
                    key={key}
                    className={`cal-day ${inMonth ? "" : "out"} ${past ? "past" : ""} ${key === TODAY ? "today" : ""} ${over === key ? "over" : ""}`}
                    onDragOver={(e) => { if (!past) { e.preventDefault(); setOver(key); } }}
                    onDragLeave={() => setOver((o) => (o === key ? null : o))}
                    onDrop={(e) => !past && onDrop(e, key)}
                  >
                    <span className="day-num">{key === TODAY ? <span className="today-chip">{d.getDate()} · Today</span> : d.getDate()}</span>
                    {placing && !past && <button className="place-here" onClick={() => placeDesign(placing, key)} aria-label={`Place on ${fmtDay(key)}`} />}
                    {list.slice(0, 3).map((p) => (
                      <a
                        key={p.id}
                        href={p.status === "failed" ? "#/activity" : `#/compose/${p.id}`}
                        className={`cal-post c-${p.status}`}
                        draggable={p.status === "scheduled" || p.status === "draft"}
                        onDragStart={(e) => { e.dataTransfer.setData("text/plain", `post:${p.id}`); e.dataTransfer.effectAllowed = "move"; }}
                        title={`${p.title} · ${fmtTime(p.time)} · ${p.status}`}
                      >
                        <img src={design(p.designId).img} alt="" />
                        <span>{fmtShortTime(p.time)}</span>
                        <PlatformIcons platforms={p.platforms} size={13} />
                      </a>
                    ))}
                    {list.length > 3 && <span className="more">+{list.length - 3} more</span>}
                    {over === key && <><span className="drop-label"><Icon name="plus" size={14} /> Drop to schedule</span><span className="drop-hint">{fmtDay(key)} · then choose time</span></>}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
