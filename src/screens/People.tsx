import { useState } from "react";
import { PEOPLE_LIST } from "../data";
import { useStore } from "../store";
import { Avatar, Facebook, Instagram } from "../components/Brand";
import { Icon } from "../components/Icon";
import { useToast } from "../components/Toasts";

type Tab = "worth" | "warm" | "everyone";
type Tone = "friendly" | "helpful" | "offer";
const HEAT = { hot: { label: "Hot", cls: "hot" }, warm: { label: "Warm", cls: "warm" }, new: { label: "New", cls: "new" } } as const;

// 14 · People · Who to talk to next
export function People() {
  const { design, contacted, setContacted } = useStore();
  const { notify } = useToast();
  const [tab, setTab] = useState<Tab>("worth");
  const [selected, setSelected] = useState("aisha");
  const [tone, setTone] = useState<Tone>("friendly");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  const list = PEOPLE_LIST.filter((p) => !contacted.includes(p.id));
  const shown = tab === "worth" ? list : tab === "warm" ? list.filter((p) => p.heat === "warm") : PEOPLE_LIST;
  const person = PEOPLE_LIST.find((p) => p.id === selected) ?? list[0];
  const key = `${person.id}-${tone}`;
  const message = drafts[key] ?? person.messages[tone];
  const dmUrl = person.platform === "ig" ? "https://www.instagram.com/direct/inbox/" : "https://www.facebook.com/messages/";

  const copy = () => navigator.clipboard.writeText(message).then(() => notify("Message copied")).catch(() => notify("Couldn't reach the clipboard. Select the text and copy it"));
  const markContacted = () => {
    const id = person.id;
    setContacted((c) => [...c, id]);
    const next = list.find((p) => p.id !== id);
    if (next) setSelected(next.id);
    notify(`${person.name.split(" ")[0]} marked as contacted`, () => { setContacted((c) => c.filter((x) => x !== id)); setSelected(id); });
  };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <span className="overline">KNOW WHO TO TALK TO NEXT <span className="concept">Concept · for discussion</span></span>
          <h1>Who to talk to next</h1>
        </div>
        <span className="pill white"><Icon name="clock" size={14} /> Updated today, 8:00 AM</span>
      </header>

      <div className="people">
        <div className="stack">
          <div className="seg" role="tablist" aria-label="Lists">
            <button role="tab" aria-selected={tab === "worth"} className={tab === "worth" ? "on" : ""} onClick={() => setTab("worth")}>Worth a message <small>{list.length}</small></button>
            <button role="tab" aria-selected={tab === "warm"} className={tab === "warm" ? "on" : ""} onClick={() => setTab("warm")}>Warm <small>12</small></button>
            <button role="tab" aria-selected={tab === "everyone"} className={tab === "everyone" ? "on" : ""} onClick={() => setTab("everyone")}>Everyone <small>148</small></button>
          </div>
          <ul className="people-list">
            {shown.map((p) => (
              <li key={p.id}>
                <button className={`person ${p.id === person.id ? "on" : ""} ${contacted.includes(p.id) ? "done" : ""}`} onClick={() => setSelected(p.id)}>
                  <span className="av-wrap"><Avatar initials={p.initials} color={p.color} size={40} />{p.platform === "ig" ? <Instagram size={15} /> : <Facebook size={15} />}</span>
                  <span className="person-body">
                    <span className="person-top"><b>{p.name}</b>{contacted.includes(p.id) ? <span className="heat done"><Icon name="check" size={12} /> Contacted</span> : <span className={`heat ${HEAT[p.heat].cls}`}>{p.heat === "new" ? "✦" : "🔥"} {HEAT[p.heat].label}</span>}</span>
                    <small>{p.summary}</small>
                  </span>
                  <span className="person-ago">{p.ago}<Icon name="chevronRight" size={15} /></span>
                </button>
              </li>
            ))}
            {shown.length === 0 && <li className="card empty-state"><Icon name="checkCircle" size={24} /><b>Everyone's been contacted</b><p className="muted">New people appear here as they engage.</p></li>}
          </ul>
        </div>

        <section className="card person-detail" aria-label={person.name}>
          <header>
            <Avatar initials={person.initials} color={person.color} size={52} />
            <span><h2>{person.name}</h2><small>{person.platform === "ig" ? <Instagram size={14} /> : <Facebook size={14} />} {person.handle} · follows you since {person.since}</small></span>
            <button className="btn btn-white sm" onClick={markContacted} disabled={contacted.includes(person.id)}><Icon name="checkCircle" size={15} /> {contacted.includes(person.id) ? "Contacted" : "Mark as contacted"}</button>
          </header>

          <div className="why-now">
            <b><Icon name="sparkle" size={15} /> Why now</b>
            <ul>{person.why.map((w) => <li key={w}><Icon name="check" size={14} /> {w}</li>)}</ul>
          </div>

          <div>
            <span className="overline">RECENT ACTIVITY</span>
            <div className="recent">
              <img src={design(person.recent.designId).img} alt="" />
              <span><b>“{person.recent.quote}”</b><small>{person.recent.where} · {person.recent.when}</small></span>
            </div>
          </div>

          <div className="suggest">
            <div className="suggest-head">
              <b>Suggested message</b>
              <div className="chips" role="group" aria-label="Tone">
                {(["friendly", "helpful", "offer"] as Tone[]).map((t) => <button key={t} className={`chip sm ${tone === t ? "dark" : ""}`} aria-pressed={tone === t} onClick={() => setTone(t)}>{t === "friendly" ? "Friendly" : t === "helpful" ? "Helpful" : "With offer"}</button>)}
              </div>
            </div>
            <textarea rows={4} value={message} onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))} aria-label="Message to send" />
            <div className="suggest-foot">
              <span className="muted small">Edit freely. Nothing is sent automatically.</span>
              <button className="btn btn-white sm" onClick={copy}><Icon name="copy" size={14} /> Copy</button>
              <a className="btn btn-grad sm" href={dmUrl} target="_blank" rel="noreferrer"><Icon name="external" size={14} /> Open {person.platform === "ig" ? "Instagram" : "Messenger"} DM</a>
            </div>
          </div>

          <div className="concept-box">
            <span>{vote ? "Thanks, noted for the next design round." : "Concept: would this help you decide who to message?"}</span>
            <button className={`icon-btn ${vote === "up" ? "voted" : ""}`} aria-label="Yes, helpful" aria-pressed={vote === "up"} onClick={() => setVote("up")}><Icon name="thumbUp" size={16} /></button>
            <button className={`icon-btn ${vote === "down" ? "voted" : ""}`} aria-label="Not helpful" aria-pressed={vote === "down"} onClick={() => setVote("down")}><Icon name="thumbDown" size={16} /></button>
          </div>
        </section>
      </div>
    </div>
  );
}
