import { useMemo, useState } from "react";
import { igReady, type Source } from "../data";
import { go, useStore } from "../store";
import { Canva, Gamma } from "../components/Brand";
import { Icon } from "../components/Icon";
import { useToast } from "../components/Toasts";

// 08 · Designs · Select
export function Designs() {
  const { designs, setReady } = useStore();
  const { notify } = useToast();
  const [source, setSource] = useState<Source | "all">("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>(["d1", "d3", "d6"]);

  const list = useMemo(() => designs
    .filter((d) => source === "all" || d.source === source)
    .filter((d) => d.title.toLowerCase().includes(q.toLowerCase())), [designs, source, q]);

  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const addToCalendar = () => {
    setReady((r) => [...new Set([...r, ...selected])]);
    notify(`${selected.length} design${selected.length > 1 ? "s" : ""} ready to schedule`);
    go("calendar");
  };

  return (
    <div className="page has-bar">
      <header className="page-head">
        <div><span className="overline">DESIGN LIBRARY · 284 DESIGNS</span><h1>Designs</h1></div>
        <a className="btn btn-white" href="https://www.canva.com" target="_blank" rel="noreferrer"><Icon name="external" size={16} /> Create new in Canva</a>
      </header>

      <div className="toolbar between">
        <div className="seg" role="group" aria-label="Source">
          <button className={source === "all" ? "on" : ""} aria-pressed={source === "all"} onClick={() => setSource("all")}>All <small>284</small></button>
          <button className={source === "Canva" ? "on" : ""} aria-pressed={source === "Canva"} onClick={() => setSource("Canva")}><Canva size={16} /> Canva <small>248</small></button>
          <button className={source === "Gamma" ? "on" : ""} aria-pressed={source === "Gamma"} onClick={() => setSource("Gamma")}><Gamma size={16} /> Gamma <small>36</small></button>
        </div>
        <label className="search sm"><Icon name="search" size={15} /><input placeholder="Search designs" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search designs" /></label>
      </div>

      {list.length === 0 ? (
        <div className="empty-state card"><Icon name="image" size={28} /><b>No designs match “{q}”</b><button className="btn btn-white" onClick={() => { setQ(""); setSource("all"); }}>Clear search</button></div>
      ) : (
        <ul className="design-grid">
          {list.map((d) => {
            const on = selected.includes(d.id);
            return (
              <li key={d.id} className={`design ${on ? "on" : ""}`}>
                <label>
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(d.id)} />
                  <span className="design-img"><img src={d.img} alt="" /><span className="tick" aria-hidden="true">{on && <Icon name="check" size={14} strokeWidth={3} />}</span></span>
                  <span className="design-meta">
                    <b>{d.title}</b>
                    <span className="row-sm">
                      <small>{d.source === "Canva" ? <Canva size={14} /> : <Gamma size={14} />} {d.source} · {d.size}</small>
                      {!igReady(d.size) && <span className="pill warn sm" title="Instagram needs 4:5 to 1.91:1"><Icon name="crop" size={12} /> Needs crop</span>}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {selected.length > 0 && (
        <div className="select-bar" role="region" aria-label="Selection">
          <span className="sel-thumbs">{selected.slice(0, 3).map((id) => <img key={id} src={designs.find((d) => d.id === id)!.img} alt="" />)}</span>
          <b>{selected.length} design{selected.length > 1 ? "s" : ""} selected</b>
          <button className="link light" onClick={() => setSelected([])}>Clear</button>
          <button className="btn btn-grad" onClick={addToCalendar}><Icon name="calendar" size={16} /> Add to calendar</button>
        </div>
      )}
    </div>
  );
}
