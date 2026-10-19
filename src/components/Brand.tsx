// Brand marks used in the design: Ampliphy logo, Canva, Gamma, Facebook, Instagram, Google.
import type { Platform } from "../data";

export function Logo({ withName = true }: { withName?: boolean }) {
  return (
    <span className="logo">
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="8" cy="12" r="1.6" fill="#fff" stroke="none" />
          <path d="M12 8.5a5 5 0 0 1 0 7M15.5 6a8.5 8.5 0 0 1 0 12" />
        </svg>
      </span>
      {withName && <span className="logo-name">Ampliphy</span>}
    </span>
  );
}

export const Canva = ({ size = 20 }: { size?: number }) => (
  <span className="mark canva" style={{ width: size, height: size, fontSize: size * 0.55 }} aria-label="Canva">C</span>
);
export const Gamma = ({ size = 20 }: { size?: number }) => (
  <span className="mark gamma" style={{ width: size, height: size, fontSize: size * 0.6, borderRadius: size * 0.28 }} aria-label="Gamma">γ</span>
);

export const Facebook = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Facebook" role="img">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path d="M13.4 19v-6h2l.3-2.4h-2.3V9.1c0-.7.2-1.2 1.2-1.2h1.2V5.8a16 16 0 0 0-1.8-.1c-1.8 0-3 1.1-3 3.1v1.8H9V13h2v6z" fill="#fff" />
  </svg>
);

export const Instagram = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Instagram" role="img">
    <defs>
      <linearGradient id="ig-g" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#FEDA75" /><stop offset=".35" stopColor="#FA7E1E" /><stop offset=".6" stopColor="#D62976" /><stop offset="1" stopColor="#4F5BD5" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6.5" fill="url(#ig-g)" />
    <rect x="5.5" y="5.5" width="13" height="13" rx="4" fill="none" stroke="#fff" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="1.7" />
    <circle cx="16.3" cy="7.7" r="1" fill="#fff" />
  </svg>
);

export const Google = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
  </svg>
);

export function PlatformIcons({ platforms, size = 16 }: { platforms: Platform[]; size?: number }) {
  return (
    <span className="plat-icons">
      {platforms.includes("fb") && <Facebook size={size} />}
      {platforms.includes("ig") && <Instagram size={size} />}
    </span>
  );
}

export function Avatar({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
  return <span className="avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.36 }}>{initials}</span>;
}
