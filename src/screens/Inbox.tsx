import { useState } from "react";
import { INBOX_POSTS, PEOPLE_LIST, REPLY_SUGGESTIONS, type Platform } from "../data";
import { useStore } from "../store";
import { Avatar, Facebook, Instagram, PlatformIcons } from "../components/Brand";
import { Icon } from "../components/Icon";
import { useToast } from "../components/Toasts";

type Filter = "all" | "unreplied" | Platform;

// 12 · Inbox · Comments
export function Inbox() {
  const { comments, setComments, design } = useStore();
  const { notify } = useToast();
  const [postId, setPostId] = useState("ip1");
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [replyTo, setReplyTo] = useState<string>("c1");
  const [draft, setDraft] = useState(REPLY_SUGGESTIONS.c1);
  const [suggested, setSuggested] = useState(true);

  const person = (id: string) => PEOPLE_LIST.find((p) => p.id === id)!;
  const unrepliedFor = (id: string) => comments.filter((c) => c.postId === id && !c.replied && !c.hidden).length;
  const totalUnreplied = comments.filter((c) => !c.replied && !c.hidden).length;
  const posts = INBOX_POSTS.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || comments.some((c) => c.postId === p.id && person(c.person).name.toLowerCase().includes(q.toLowerCase())));
  const post = INBOX_POSTS.find((p) => p.id === postId)!;
  const thread = comments.filter((c) => c.postId === postId && !c.hidden)
    .filter((c) => filter === "all" || (filter === "unreplied" ? !c.replied : c.platform === filter));
  const target = comments.find((c) => c.id === replyTo && c.postId === postId);

  const startReply = (id: string) => { setReplyTo(id); setDraft(""); setSuggested(false); };
  const suggest = () => {
    if (!target) return;
    setDraft(REPLY_SUGGESTIONS[target.id] ?? `Thanks so much, ${person(target.person).name.split(" ")[0]}! 💜`);
    setSuggested(true);
  };
  const send = () => {
    if (!target || !draft.trim()) return;
    const text = draft.trim();
    setComments((cs) => cs.map((c) => c.id === target.id ? { ...c, replied: text } : c));
    notify(`Replied to ${person(target.person).name.split(" ")[0]} on ${target.platform === "ig" ? "Instagram" : "Facebook"}`,
      () => setComments((cs) => cs.map((c) => c.id === target.id ? { ...c, replied: undefined } : c)));
    const next = comments.find((c) => c.postId === postId && !c.replied && !c.hidden && c.id !== target.id);
    setReplyTo(next?.id ?? ""); setDraft(""); setSuggested(false);
  };
  const hide = (id: string) => {
    setComments((cs) => cs.map((c) => c.id === id ? { ...c, hidden: true } : c));
    notify("Comment hidden. Only you can see it now", () => setComments((cs) => cs.map((c) => c.id === id ? { ...c, hidden: false } : c)));
  };

  return (
    <div className="page">
      <header className="page-head">
        <div><span className="overline">MANAGE · FACEBOOK &amp; INSTAGRAM · <a className="link" href="#/engagement">Engagement overview</a></span><h1>Inbox</h1></div>
        <div className="seg" role="group" aria-label="Filter comments">
          {(["all", "unreplied", "fb", "ig"] as Filter[]).map((f) => (
            <button key={f} className={filter === f ? "on" : ""} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? <>All <small>{comments.filter((c) => !c.hidden).length}</small></> : f === "unreplied" ? <>Unreplied <small>{totalUnreplied}</small></> : f === "fb" ? "Facebook" : "Instagram"}
            </button>
          ))}
        </div>
      </header>

      <div className="inbox">
        <aside className="card inbox-posts">
          <label className="search sm wide"><Icon name="search" size={15} /><input placeholder="Search posts or people" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search posts or people" /></label>
          <ul>
            {posts.map((p) => {
              const n = unrepliedFor(p.id);
              return (
                <li key={p.id}>
                  <button className={`inbox-post ${p.id === postId ? "on" : ""}`} onClick={() => { setPostId(p.id); const first = comments.find((c) => c.postId === p.id && !c.replied && !c.hidden); setReplyTo(first?.id ?? ""); setDraft(""); setSuggested(false); }}>
                    <img src={design(p.designId).img} alt="" />
                    <span className="ip-body"><b>{p.title}</b>
                      <small><span><Icon name="heart" size={12} /> {p.likes}</span><span><Icon name="send" size={12} /> {p.shares}</span><span><Icon name="comment" size={12} /> {p.comments}</span></small>
                    </span>
                    <span className="ip-side"><PlatformIcons platforms={p.platforms} size={13} />{n > 0 && <span className="unread" aria-label={`${n} unreplied`}>{n}</span>}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="card thread" aria-label={`Comments on ${post.title}`}>
          <header className="thread-head">
            <img src={design(post.designId).img} alt="" />
            <span><b>{post.title}</b><small>Published {post.published} · {post.platforms.map((p) => p === "fb" ? "Facebook" : "Instagram").join(" & ")}</small></span>
            <a className="btn btn-white sm" href="#/activity"><Icon name="external" size={14} /> View post</a>
          </header>
          <div className="thread-stats">
            <div><span><Icon name="heart" size={14} /> Likes</span><b>{post.likes}</b><small>FB {post.split.likes[0]} · IG {post.split.likes[1]}</small></div>
            <div><span><Icon name="send" size={14} /> Shares</span><b>{post.shares}</b><small>FB {post.split.shares[0]} · IG {post.split.shares[1]}</small></div>
            <div><span><Icon name="comment" size={14} /> Comments</span><b>{post.comments}</b><small>{unrepliedFor(post.id)} unreplied</small></div>
            <div><span><Icon name="globe" size={14} /> Reach</span><b>{post.reach}</b><small>{post.reachNote}</small></div>
          </div>

          <ul className="comments">
            {thread.length === 0 && <li className="muted empty-line">No comments match this filter.</li>}
            {thread.map((c) => {
              const p = person(c.person);
              return (
                <li key={c.id} className={`comment ${c.id === replyTo ? "on" : ""}`}>
                  <span className="av-wrap"><Avatar initials={p.initials} color={p.color} size={36} />{c.platform === "ig" ? <Instagram size={14} /> : <Facebook size={14} />}</span>
                  <div className="comment-body">
                    <div className="comment-top"><b>{p.name}</b><small>{c.ago}</small>{c.replied ? <span className="pill ok sm"><Icon name="check" size={12} /> Replied</span> : <span className="pill pinkish sm">Unreplied</span>}</div>
                    <p>{c.text}</p>
                    <div className="comment-actions">
                      <button onClick={() => startReply(c.id)}><Icon name="undo" size={13} /> Reply</button>
                      <button aria-pressed={!!c.liked} className={c.liked ? "liked" : ""} onClick={() => setComments((cs) => cs.map((x) => x.id === c.id ? { ...x, liked: !x.liked } : x))}><Icon name="heart" size={13} /> {c.liked ? "Liked" : "Like"}</button>
                      <button onClick={() => hide(c.id)}><Icon name="x" size={13} /> Hide</button>
                    </div>
                    {c.worth && !c.replied && <a className="worth" href="#/people"><Icon name="sparkle" size={13} /> Worth a message · see in People</a>}
                    {c.replied && <div className="my-reply"><span className="me-dot">RG</span>{c.replied}</div>}
                  </div>
                </li>
              );
            })}
          </ul>

          <footer className="composer">
            <div className="composer-top">
              <span className="muted small">{target ? `Replying to ${person(target.person).name.split(" ")[0]} on ${target.platform === "ig" ? "Instagram" : "Facebook"}` : "Pick a comment to reply to"}</span>
              <button className="chip sm soft" onClick={suggest} disabled={!target}><Icon name="sparkle" size={13} /> Suggest a reply</button>
            </div>
            <form className="composer-box" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <input value={draft} onChange={(e) => { setDraft(e.target.value); setSuggested(false); }} placeholder={target ? "Write a reply…" : "Select Reply on a comment"} disabled={!target} aria-label="Reply" />
              <button className="send" type="submit" disabled={!target || !draft.trim()} aria-label="Send reply"><Icon name="send" size={16} /></button>
            </form>
            {suggested && draft && <p className="muted small">Suggested reply. Edit it freely; nothing is sent until you press send.</p>}
          </footer>
        </section>
      </div>
    </div>
  );
}
