import type { Status } from "../data";

const LABEL: Record<Status, string> = { draft: "Draft", scheduled: "Scheduled", publishing: "Publishing", published: "Published", failed: "Failed" };

export function StatusPill({ status }: { status: Status }) {
  return <span className={`status s-${status}`}><i aria-hidden="true" />{LABEL[status]}</span>;
}
