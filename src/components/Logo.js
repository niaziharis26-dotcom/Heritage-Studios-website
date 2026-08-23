'use client';

export default function Logo({ className = '', style }) {
  return (
    <div className={`hs-brand-logo ${className}`} style={style}>
      {/* Fingerprint / Tech Waves Mark */}
      <svg
        className="hs-brand-icon"
        viewBox="0 0 64 64"
        width="32"
        height="32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 36C12 24.9543 20.9543 16 32 16C43.0457 16 52 24.9543 52 36C52 40.5 50.5 44.5 48 47.5"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M18 36C18 28.268 24.268 22 32 22C39.732 22 46 28.268 46 36C46 41 43.5 45.5 40 48.5"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1 0"
        />
        <path
          d="M24 36C24 31.5817 27.5817 28 32 28C36.4183 28 40 31.5817 40 36C40 40 37.5 43.5 34 45.5"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M30 36C30 34.8954 30.8954 34 32 34C33.1046 34 34 34.8954 34 36V44"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M8 38C8 22.536 20.536 10 36 10C48.5 10 58 18.5 60 30"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>

      {/* Heritage Studios Typography */}
      <div className="hs-brand-text">
        <span className="hs-brand-title">HERITAGE</span>
        <span className="hs-brand-sub">STUDIOS</span>
      </div>
    </div>
  );
}
