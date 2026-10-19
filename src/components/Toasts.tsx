import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

// Every AI action that changes something shows a toast with Undo.
// Reversibility is what makes people willing to click "Apply".
type Toast = { id: number; message: string; undo?: () => void };
type Ctx = { notify: (message: string, undo?: () => void) => void };

const ToastContext = createContext<Ctx>({ notify: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const notify = useCallback((message: string, undo?: () => void) => {
    const id = nextId.current++;
    setToasts((t) => [...t.slice(-2), { id, message, undo }]);
    window.setTimeout(() => dismiss(id), 7000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <Icon name="check" size={16} />
            <span>{t.message}</span>
            {t.undo && (
              <button className="toast-undo" onClick={() => { t.undo?.(); dismiss(t.id); }}>
                <Icon name="undo" size={14} /> Undo
              </button>
            )}
            <button className="icon-btn" aria-label="Dismiss" onClick={() => dismiss(t.id)}><Icon name="x" size={14} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
