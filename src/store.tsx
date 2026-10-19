import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { COMMENTS, DESIGNS, INITIAL_POSTS, READY_TO_SCHEDULE, type Comment, type Design, type Post } from "./data";

// ---- Routing (hash based so it works on any static host) ----
export type Route =
  | "signin" | "sent" | "guide" | "connect-design" | "connect-social" | "connected"
  | "home" | "designs" | "calendar" | "compose" | "activity" | "inbox" | "engagement" | "people";

const readHash = (): { route: Route; param?: string } => {
  const [route, param] = window.location.hash.replace(/^#\/?/, "").split("/");
  return { route: (route || "signin") as Route, param };
};

export function useRouter() {
  const [state, setState] = useState(readHash);
  useEffect(() => {
    const on = () => { setState(readHash()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return state;
}
export const go = (route: Route, param?: string) => { window.location.hash = `/${route}${param ? `/${param}` : ""}`; };

// ---- App state ----
type Connections = { canva: boolean; gamma: boolean; pages: Record<string, boolean> };
type Store = {
  email: string; setEmail: (e: string) => void;
  connections: Connections; setConnections: (c: Connections) => void;
  posts: Post[]; setPosts: (fn: (p: Post[]) => Post[]) => void;
  ready: string[]; setReady: (fn: (r: string[]) => string[]) => void;
  designs: Design[];
  design: (id: string) => Design;
  comments: Comment[]; setComments: (fn: (c: Comment[]) => Comment[]) => void;
  contacted: string[]; setContacted: (fn: (c: string[]) => string[]) => void;
};

const Ctx = createContext<Store | null>(null);
export const useStore = () => useContext(Ctx)!;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("emma@roseglow.co");
  const [connections, setConnections] = useState<Connections>({ canva: true, gamma: false, pages: { rose: true, outlet: false } });
  const [posts, setPostsState] = useState<Post[]>(INITIAL_POSTS);
  const [ready, setReadyState] = useState<string[]>(READY_TO_SCHEDULE);
  const setPosts = useCallback((fn: (p: Post[]) => Post[]) => setPostsState(fn), []);
  const setReady = useCallback((fn: (r: string[]) => string[]) => setReadyState(fn), []);
  const design = useCallback((id: string) => DESIGNS.find((d) => d.id === id) ?? DESIGNS[0], []);
  const [comments, setCommentsState] = useState<Comment[]>(COMMENTS);
  const [contacted, setContactedState] = useState<string[]>([]);
  const setComments = useCallback((fn: (c: Comment[]) => Comment[]) => setCommentsState(fn), []);
  const setContacted = useCallback((fn: (c: string[]) => string[]) => setContactedState(fn), []);

  return (
    <Ctx.Provider value={{ email, setEmail, connections, setConnections, posts, setPosts, ready, setReady, designs: DESIGNS, design, comments, setComments, contacted, setContacted }}>
      {children}
    </Ctx.Provider>
  );
}

// ---- Date helpers ----
export const parseDate = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
export const toKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const fmtTime = (t: string) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
export const fmtShortTime = (t: string) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""}${h < 12 ? "a" : "p"}`; };
export const fmtDay = (s: string) => parseDate(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
