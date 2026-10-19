import { useEffect, useState, type ReactNode } from "react";
import { go, useStore } from "../store";
import { Avatar, Canva, Facebook, Gamma, Google, Instagram, Logo } from "../components/Brand";
import { Icon } from "../components/Icon";
import { useToast } from "../components/Toasts";

const STEPS = ["Sign in", "Design tools", "Facebook & Instagram", "Ready"];

function OnboardShell({ step, children, right }: { step?: number; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="onboard">
      <header className="onboard-top">
        <Logo />
        {step !== undefined && (
          <ol className="stepper" aria-label="Setup progress">
            {STEPS.map((s, i) => (
              <li key={s} className={i < step ? "done" : i === step ? "now" : ""} aria-current={i === step ? "step" : undefined}>
                <span className="step-dot">{i < step ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}</span>
                <span className="step-label">{s}</span>
              </li>
            ))}
          </ol>
        )}
        {right ?? (step !== undefined && <a className="guide-link" href="#/guide"><Icon name="book" size={15} /> Quick-start guide</a>)}
      </header>
      <main className="onboard-main">{children}</main>
    </div>
  );
}

// 01 · Trial invite · Sign in
export function SignIn() {
  const { email, setEmail } = useStore();
  const [touched, setTouched] = useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const week = [
    { d: "MON", img: "gift-set", p: "ig", t: "9 AM" },
    { d: "TUE", img: "review", p: "ig", t: "6 PM" },
    { d: "WED" },
    { d: "THU", img: "face-oil", p: "ig", t: "7:30 PM" },
    { d: "FRI", img: "morning", p: "fb", t: "12 PM" }
  ];
  return (
    <OnboardShell right={<span className="muted small">Already have an account? <a className="link" href="#/sent">Sign in</a></span>}>
      <div className="signin">
        <section className="signin-form">
          <span className="badge-soft"><Icon name="mail" size={14} /> Invited by Lyon Inc · 14-day trial</span>
          <h1>Welcome, Emma.<br />Your trial is ready.</h1>
          <p className="lead">Plan a month of Facebook and Instagram posts from your Canva or Gamma designs, then see who is engaging and who to talk to next.</p>
          <button className="btn btn-white wide" onClick={() => go("guide")}><Google /> Continue with Google</button>
          <div className="or"><span>or use your work email</span></div>
          <form onSubmit={(e) => { e.preventDefault(); setTouched(true); if (valid) go("sent"); }} noValidate>
            <label className="field">
              <span>Work email</span>
              <span className={`input ${touched && !valid ? "invalid" : ""}`}>
                <Icon name="mail" size={17} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={touched && !valid} aria-describedby="email-err" />
              </span>
              {touched && !valid && <span className="err" id="email-err">Enter a valid email so we can send your sign-in link.</span>}
            </label>
            <button className="btn btn-grad wide" type="submit">Email me a magic link <Icon name="arrowRight" size={16} /></button>
          </form>
          <p className="fine">No password needed. By continuing you agree to the Terms and Privacy Policy.</p>
        </section>

        <section className="signin-card" aria-label="What Ampliphy does">
          <h2>Plan your month.<br />Know who to talk to.</h2>
          <p className="sc-sub">Facebook and Instagram, planned from your Canva or Gamma designs.</p>
          <div className="sc-week">
            <header><b><Icon name="calendar" size={15} /> This week</b><small>5 posts planned</small><span className="pill ok sm"><Icon name="check" size={12} /> Auto-publishing</span></header>
            <ol>
              {week.map((w) => (
                <li key={w.d}>
                  <small>{w.d}</small>
                  {w.img ? <span className="sc-thumb"><img src={`designs/${w.img}.jpg`} alt="" />{w.p === "ig" ? <Instagram size={14} /> : <Facebook size={14} />}</span> : <span className="sc-thumb empty"><Icon name="plus" size={16} /></span>}
                  <small className="t">{w.t ?? ""}</small>
                </li>
              ))}
            </ol>
          </div>
          <div className="sc-stage">
            <article className="sc-post">
              <header><img src="designs/restock.jpg" alt="" /><b>roseglow.co</b><Instagram size={16} /></header>
              <img className="sc-media" src="designs/review.jpg" alt="" />
              <footer><span><Icon name="heart" size={14} /> 486</span><span><Icon name="comment" size={14} /> 23</span><small>2h ago</small></footer>
            </article>
            <div className="sc-worth">
              <span className="worth-tag"><Icon name="sparkle" size={13} /> Worth a message</span>
              <div><Avatar initials="AR" color="#e0457b" size={34} /><span><b>Aisha Rahman</b><small>Asked about the gift set price twice</small></span></div>
            </div>
          </div>
          <span className="sc-published"><Icon name="checkCircle" size={15} /> Published to Facebook &amp; Instagram</span>
        </section>
      </div>
    </OnboardShell>
  );
}

// 02 · Magic link sent
export function MagicLink() {
  const { email } = useStore();
  const { notify } = useToast();
  const [left, setLeft] = useState(42);
  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left]);
  return (
    <OnboardShell>
      <div className="magic">
        <div className="center-card card">
          <span className="icon-bubble"><Icon name="mail" size={26} /></span>
          <h1>Check your inbox</h1>
          <p>We sent a magic sign-in link to {email}. Open it on this device. It expires in 15 minutes.</p>
          <a className="btn btn-white sm" href="https://mail.google.com" target="_blank" rel="noreferrer"><Icon name="external" size={14} /> Open Gmail</a>
          <p className="muted small">
            Didn't get it?{" "}
            {left > 0 ? <span>Resend in 0:{String(left).padStart(2, "0")}</span> :
              <button className="link sm" onClick={() => { setLeft(42); notify(`New link sent to ${email}`); }}>Resend link</button>}
          </p>
          <a className="link sm" href="#/signin">Use a different email</a>
        </div>
        <button className="demo-skip" onClick={() => go("guide")}>Prototype: open the magic link <Icon name="arrowRight" size={14} /></button>
      </div>
    </OnboardShell>
  );
}

// 03 · Quick-start guide
export function Guide() {
  const cards = [
    { art: <><Canva size={46} /><Gamma size={46} /></>, title: "Connect your design tool", text: "Pull in your existing designs and templates." },
    { art: <><Facebook size={46} /><Instagram size={46} /></>, title: "Link Facebook & Instagram", text: "Sign in with Facebook and pick your Page." },
    { art: <span className="art-cal"><Icon name="calendar" size={26} /></span>, title: "Plan a month of posts", text: "Drag designs onto days. Add captions." },
    { art: <span className="art-avatars"><i style={{ background: "#e0457b" }}>AR</i><i style={{ background: "#7c4dff" }}>LM</i><i style={{ background: "#f59e0b" }}>PN</i></span>, title: "Publish, engage, follow up", text: "Reply to comments. See who to message." }
  ];
  return (
    <OnboardShell step={1}>
      <div className="guide">
        <span className="badge-soft"><Icon name="book" size={14} /> Quick-start guide · 2 min read</span>
        <h1>Here's how Ampliphy works</h1>
        <p className="lead">You are signed in. Four short steps and your first month of posts is on the calendar.</p>
        <ol className="guide-cards">
          {cards.map((c) => (
            <li key={c.title} className="card">
              <div className="guide-art">{c.art}</div>
              <div className="guide-body"><h3>{c.title}</h3><p>{c.text}</p></div>
            </li>
          ))}
        </ol>
        <div className="row center gap-lg">
          <a className="link" href="#/home">Skip guide</a>
          <button className="btn btn-grad" onClick={() => go("connect-design")}>Start setup <Icon name="arrowRight" size={16} /></button>
        </div>
        <p className="fine center"><Icon name="lock" size={13} /> We never post without your say-so. Nothing in Canva, Gamma or Facebook is changed.</p>
      </div>
    </OnboardShell>
  );
}

// 04 · Connect · Canva & Gamma
export function ConnectDesign() {
  const { connections, setConnections } = useStore();
  const { notify } = useToast();
  const [connecting, setConnecting] = useState(false);
  const count = (connections.canva ? 1 : 0) + (connections.gamma ? 1 : 0);
  const connectGamma = () => {
    setConnecting(true);
    window.setTimeout(() => {
      setConnecting(false);
      setConnections({ ...connections, gamma: true });
      notify("Gamma connected · 36 cards found", () => setConnections({ ...connections, gamma: false }));
    }, 1400);
  };
  return (
    <OnboardShell step={1}>
      <div className="setup">
        <span className="badge-soft sm">Step 2 of 4 · Design tools</span>
        <h1>Where do your designs live?</h1>
        <p className="lead">Connect one or both. We pull in your existing designs and templates. Nothing in your Canva or Gamma account is changed.</p>
        <div className="tool-grid">
          <article className={`card tool ${connections.canva ? "is-on" : ""}`}>
            <header><Canva size={40} /><div><b>Canva</b><small>Emma's team · Canva Pro</small></div><span className="pill ok"><Icon name="check" size={13} /> Connected</span></header>
            <div className="tool-thumbs">{["review", "face-oil", "ingredient", "serum"].map((n) => <img key={n} src={`designs/${n}.jpg`} alt="" />)}</div>
            <footer><span className="muted small"><Icon name="sync" size={13} /> Synced just now</span><button className="link sm" onClick={() => notify("Canva settings open in Settings → Connections")}>Manage</button></footer>
          </article>

          <article className={`card tool ${connections.gamma ? "is-on" : ""}`}>
            <header><Gamma size={40} /><div><b>Gamma</b><small>Presentations, docs and social cards</small></div>
              {connections.gamma ? <span className="pill ok"><Icon name="check" size={13} /> Connected</span> : <span className="pill grey">Optional</span>}</header>
            {connections.gamma ? (
              <>
                <div className="tool-thumbs">{["serum", "ingredient"].map((n) => <img key={n} src={`designs/${n}.jpg`} alt="" />)}</div>
                <footer><span className="muted small"><Icon name="sync" size={13} /> 36 cards · synced just now</span></footer>
              </>
            ) : (
              <button className="btn btn-grad wide" onClick={connectGamma} disabled={connecting} aria-busy={connecting}>
                {connecting ? <><span className="spinner" /> Waiting for Gamma…</> : <><Icon name="link" size={16} /> Connect Gamma</>}
              </button>
            )}
          </article>
        </div>
        <p className="readonly"><Icon name="check" size={14} /> Read-only. We never edit, move or delete your designs.</p>
        <div className="setup-foot">
          <a className="link back" href="#/guide"><Icon name="arrowLeft" size={15} /> Back</a>
          <span className="foot-right"><span className="muted small">{count} of 2 connected</span>
            <button className="btn btn-grad" onClick={() => go("connect-social")} disabled={count === 0}>Continue <Icon name="arrowRight" size={16} /></button></span>
        </div>
      </div>
    </OnboardShell>
  );
}

// 05 · Connect · Facebook & Instagram
export function ConnectSocial() {
  const { connections, setConnections } = useStore();
  const pages = [
    { id: "rose", name: "Rose Glow Skincare", followers: "12.4k", ig: "@roseglow.co", img: "restock" },
    { id: "outlet", name: "Rose Glow Outlet", followers: "1.1k", ig: null, img: "self-care" }
  ];
  const toggle = (id: string) => setConnections({ ...connections, pages: { ...connections.pages, [id]: !connections.pages[id] } });
  const any = Object.values(connections.pages).some(Boolean);
  return (
    <OnboardShell step={2}>
      <div className="setup">
        <span className="badge-soft sm">Step 3 of 4 · Social accounts</span>
        <h1>Link Facebook &amp; Instagram</h1>
        <p className="lead">We use Facebook Login. Your Instagram must be a Business or Creator account linked to a Facebook Page.</p>
        <div className="stack social-stack">
          <section className="card social">
            <header><Facebook size={36} /><div><b>Facebook</b><small>Signed in with Facebook Login · Emma M.</small></div><span className="pill ok"><Icon name="check" size={13} /> Connected</span></header>
            <p className="label">Choose the Pages Ampliphy should manage</p>
            {pages.map((p) => (
              <label key={p.id} className={`page-row ${connections.pages[p.id] ? "on" : ""}`}>
                <input type="checkbox" checked={!!connections.pages[p.id]} onChange={() => toggle(p.id)} />
                <img src={`designs/${p.img}.jpg`} alt="" />
                <span><b>{p.name}</b><small>Page · {p.followers} followers</small></span>
                {p.ig ? <span className="pill white"><Instagram size={14} /> {p.ig} linked</span> : <span className="pill warn"><Icon name="alert" size={13} /> No Instagram linked</span>}
              </label>
            ))}
          </section>
          <section className="card social">
            <header><Instagram size={36} /><div><b>Instagram</b><small>@roseglow.co · Business account · linked to Rose Glow Skincare</small></div><span className="pill ok"><Icon name="check" size={13} /> Connected</span></header>
          </section>
          <p className="ig-note"><span><Icon name="info" size={15} /> Instagram must be a Business or Creator account.</span>
            <a className="link sm" href="https://help.instagram.com/502981923235522" target="_blank" rel="noreferrer">How to switch <Icon name="external" size={13} /></a></p>
        </div>
        <div className="setup-foot">
          <a className="link back" href="#/connect-design"><Icon name="arrowLeft" size={15} /> Back</a>
          <button className="btn btn-grad" onClick={() => go("connected")} disabled={!any}>Continue <Icon name="arrowRight" size={16} /></button>
        </div>
      </div>
    </OnboardShell>
  );
}

// 06 · Connected · Importing designs
export function Connected() {
  const [done, setDone] = useState(186);
  useEffect(() => {
    if (done >= 248) return;
    const t = window.setTimeout(() => setDone((d) => Math.min(248, d + 4)), 90);
    return () => window.clearTimeout(t);
  }, [done]);
  const thumbs = ["face-oil", "ingredient", "serum", "self-care", "behind", "review", "morning", "gift-set"];
  const shown = Math.round(((done - 186) / 62) * 2) + 6;
  return (
    <OnboardShell step={3}>
      <div className="connected">
        <span className="success-orb"><Icon name="check" size={34} strokeWidth={2.4} /></span>
        <h1>You're connected</h1>
        <p className="lead">We're bringing in your designs. You can start planning while this finishes.</p>
        <div className="row center wrap">
          <span className="pill white lg"><Canva size={18} /> Canva · 248 designs</span>
          <span className="pill white lg"><Facebook size={18} /> Rose Glow Skincare</span>
          <span className="pill white lg"><Instagram size={18} /> @roseglow.co</span>
        </div>
        <section className="card import" aria-live="polite">
          <header><Canva size={22} /><b>{done < 248 ? "Importing designs from Canva" : "All designs imported"}</b><span className="count">{done} of 248</span></header>
          <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={248} aria-valuenow={done}><i style={{ width: `${(done / 248) * 100}%` }} /></div>
          <div className="import-thumbs">
            {thumbs.map((n, i) => i < shown ? <img key={n} src={`designs/${n}.jpg`} alt="" /> : <span key={n} className="ph"><Icon name="image" size={18} /></span>)}
          </div>
        </section>
        <div className="row center">
          <button className="btn btn-white" onClick={() => go("home")}><Icon name="home" size={16} /> Take me home</button>
          <button className="btn btn-grad" onClick={() => go("calendar")}>Plan my first month <Icon name="arrowRight" size={16} /></button>
        </div>
      </div>
    </OnboardShell>
  );
}
