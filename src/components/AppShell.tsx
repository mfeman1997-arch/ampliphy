import type { ReactNode } from "react";
import { go, type Route } from "../store";
import { Icon } from "./Icon";

const NAV: { route: Route; label: string; icon: string; dot?: boolean }[] = [
  { route: "home", label: "Home", icon: "home" },
  { route: "designs", label: "Designs", icon: "grid" },
  { route: "calendar", label: "Calendar", icon: "calendar" },
  { route: "activity", label: "Activity", icon: "activity" },
  { route: "inbox", label: "Inbox", icon: "chat", dot: true },
  { route: "people", label: "People", icon: "people" }
];

// Signed-in layout: icon rail, search, account switcher, New post.
export function AppShell({ route, children }: { route: Route; children: ReactNode }) {
  const active = route === "compose" ? "calendar" : route === "engagement" ? "inbox" : route;
  return (
    <div className="shell">
      <aside className="rail" aria-label="Main">
        <a className="rail-logo" href="#/home" aria-label="Ampliphy home"><span className="orb" /></a>
        <nav>
          {NAV.map((n) => (
            <a key={n.route} href={`#/${n.route}`} className={`rail-item ${active === n.route ? "on" : ""}`} aria-current={active === n.route ? "page" : undefined}>
              <span className="rail-icon"><Icon name={n.icon} size={20} />{n.dot && <i className="dot" />}</span>
              <span>{n.label}</span>
            </a>
          ))}
        </nav>
        <span className="me" aria-label="Emma M.">EM</span>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          <label className="search">
            <Icon name="search" size={17} />
            <input placeholder="Search designs, posts or people…" aria-label="Search" />
            <kbd>⌘K</kbd>
          </label>
          <div className="topbar-right">
            <button className="icon-btn bell" aria-label="Notifications"><Icon name="bell" /></button>
            <button className="btn btn-grad" onClick={() => go("calendar")}><Icon name="plus" size={16} /> <span>New post</span></button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
