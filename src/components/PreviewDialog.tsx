import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";

// "Here is exactly what will change" before an AI action runs.
export function PreviewDialog({ title, children, confirmLabel, onConfirm, onCancel }: {
  title: string; children: ReactNode; confirmLabel: string; onConfirm: () => void; onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    return () => d?.close();
  }, []);

  return (
    <dialog ref={ref} className="dialog" onCancel={(e) => { e.preventDefault(); onCancel(); }} aria-labelledby="dlg-title">
      <header className="dialog-head">
        <div>
          <span className="eyebrow"><Icon name="shield" size={14} /> Preview. Nothing changes until you confirm</span>
          <h2 id="dlg-title">{title}</h2>
        </div>
        <button className="icon-btn" aria-label="Close" onClick={onCancel}><Icon name="x" /></button>
      </header>
      <div className="dialog-body">{children}</div>
      <footer className="dialog-foot">
        <button className="btn btn-quiet" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={onConfirm} autoFocus>{confirmLabel}</button>
      </footer>
    </dialog>
  );
}
