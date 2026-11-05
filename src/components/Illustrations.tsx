/** Topi toga biru, logo TugasKu. */
export function LogoMark({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 64 50" aria-hidden="true">
      <defs>
        <linearGradient id="logo-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f8cff" />
          <stop offset="1" stopColor="#2457e6" />
        </linearGradient>
      </defs>
      <path d="M15 25v11c0 4.4 7.6 8.5 17 8.5s17-4.1 17-8.5V25L32 33z" fill="#1d46c9" />
      <path d="M32 3L2 17l30 14 30-14z" fill="url(#logo-top)" />
      <path
        d="M32 3L2 17l30 14"
        fill="none"
        stroke="#fff"
        strokeOpacity=".28"
        strokeWidth="1.2"
      />
      <path d="M58 19.5v15" stroke="#1d46c9" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="58" cy="37" r="2.6" fill="#1d46c9" />
    </svg>
  );
}

/** Ilustrasi mahasiswa dengan laptop dan kalender, untuk banner sapaan. */
export function HeroIllustration() {
  return (
    <svg viewBox="0 0 330 200" className="hero-art" aria-hidden="true">
      <ellipse cx="170" cy="190" rx="130" ry="8" fill="#93b4f5" opacity=".25" />
      {/* kalender melayang */}
      <g>
        <rect
          x="205"
          y="18"
          width="104"
          height="84"
          rx="12"
          fill="#fff"
          stroke="#c9d8fb"
          strokeWidth="2"
        />
        <rect x="205" y="18" width="104" height="20" rx="12" fill="#5b8def" />
        <rect x="205" y="28" width="104" height="10" fill="#5b8def" />
        <rect x="226" y="10" width="7" height="16" rx="3.5" fill="#3b6fe0" />
        <rect x="281" y="10" width="7" height="16" rx="3.5" fill="#3b6fe0" />
        <rect x="217" y="48" width="16" height="16" rx="4" fill="#dbe7ff" />
        <path
          d="M221 56l3 3 5-6"
          stroke="#3b6fe0"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="240" y="52" width="58" height="6" rx="3" fill="#cfdcf9" />
        <rect x="217" y="74" width="16" height="16" rx="4" fill="#dbe7ff" />
        <path
          d="M221 82l3 3 5-6"
          stroke="#3b6fe0"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="240" y="78" width="46" height="6" rx="3" fill="#cfdcf9" />
      </g>
      {/* percikan */}
      <path
        d="M118 22l7-5M112 34l9-1M186 14l4-8"
        stroke="#3b6fe0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* tanaman */}
      <g>
        <path d="M296 150c-14-8-16-26-10-38 12 6 18 22 10 38z" fill="#4cc38a" />
        <path d="M300 152c6-14 20-20 30-18-2 14-14 22-30 18z" fill="#34a873" />
        <path d="M298 148c-2-12 2-26 10-34 6 12 2 28-10 34z" fill="#6ad7a0" />
        <path d="M282 150h30l-4 30h-22z" fill="#9db8f7" />
        <rect x="280" y="146" width="34" height="8" rx="4" fill="#b7ccfa" />
      </g>
      {/* badan (hoodie) */}
      <path d="M52 188c-6-34 6-62 34-72l30-6 34 8c22 8 30 36 26 70z" fill="#5b8def" />
      <path
        d="M96 114c4 14 22 20 36 14l12-4c-6 16-16 24-30 26-14-2-22-14-24-30z"
        fill="#7aa3f7"
      />
      <path
        d="M130 124c-2 22 2 40 4 64"
        stroke="#3b6fe0"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".5"
      />
      {/* leher + kepala */}
      <path d="M112 100h26v22c-6 8-20 8-26 0z" fill="#f2b393" />
      <ellipse cx="126" cy="76" rx="30" ry="32" fill="#f7c4a8" />
      <path
        d="M96 74c-4-26 14-42 38-40 20 2 28 16 24 34-6-8-14-12-24-12-14 0-26 6-30 18z"
        fill="#1a2b5c"
      />
      <path d="M98 68c-6 4-6 14-2 18 2-8 4-14 2-18z" fill="#1a2b5c" />
      <ellipse cx="116" cy="80" rx="2.6" ry="3.4" fill="#1a2b5c" />
      <ellipse cx="140" cy="80" rx="2.6" ry="3.4" fill="#1a2b5c" />
      <path
        d="M118 92c5 5 14 5 20 0"
        stroke="#c4624a"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="109" cy="90" rx="5" ry="3" fill="#f59a8c" opacity=".5" />
      <ellipse cx="147" cy="90" rx="5" ry="3" fill="#f59a8c" opacity=".5" />
      {/* laptop */}
      <path d="M118 188l12-62 78-4 8 66z" fill="#1c2a63" />
      <path d="M124 182l9-52 66-3 6 55z" fill="#27388a" />
      <circle cx="168" cy="152" r="5" fill="#fff" opacity=".92" />
      <path d="M100 190h130l6 6H94z" fill="#cbd9fa" />
      {/* tangan */}
      <ellipse cx="116" cy="178" rx="13" ry="9" fill="#f7c4a8" />
    </svg>
  );
}

/** Tumpukan buku dan tempat pensil, untuk bagian bawah sidebar. */
export function BooksIllustration() {
  return (
    <svg viewBox="0 0 200 170" className="books-art" aria-hidden="true">
      <ellipse cx="100" cy="158" rx="82" ry="9" fill="#93b4f5" opacity=".3" />
      <path d="M22 118l78 14 80-16v22l-80 18-78-14z" fill="#2f5fd6" />
      <path d="M22 118l78 14 80-16-78-14z" fill="#8fb1fa" />
      <path d="M22 118l78 14v22l-78-14z" fill="#3a6df0" />
      <path d="M100 132l80-16v22l-80 18z" fill="#244fc2" />
      <path d="M36 88l66 12 62-12v22l-62 14-66-12z" fill="#3a6df0" />
      <path d="M36 88l66 12 62-12-64-12z" fill="#a9c3fb" />
      <path d="M36 88l66 12v26l-66-12z" fill="#4f82f7" />
      <path d="M102 100l62-12v22l-62 14z" fill="#2c5ad6" />
      <rect x="44" y="30" width="42" height="46" rx="8" fill="#9db8f7" />
      <rect x="44" y="30" width="42" height="12" rx="6" fill="#bcd0fb" />
      <rect
        x="50"
        y="6"
        width="7"
        height="34"
        rx="3.5"
        fill="#4f82f7"
        transform="rotate(-8 53 23)"
      />
      <rect x="62" y="2" width="7" height="38" rx="3.5" fill="#7aa3f7" />
      <rect
        x="74"
        y="8"
        width="7"
        height="32"
        rx="3.5"
        fill="#3a6df0"
        transform="rotate(10 77 24)"
      />
    </svg>
  );
}
