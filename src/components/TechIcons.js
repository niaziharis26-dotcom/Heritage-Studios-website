export function getTechIcon(techName) {
  const t = techName.toLowerCase();
  
  if (t.includes('shopify')) {
    return (
      <svg viewBox="0 0 24 24" fill="#95BF47" height="24" width="24" title="Shopify">
        <path d="M19.344 6.012c-.595-.121-1.391-.019-1.956.128-1.554.407-4.484 1.341-6.84 2.152-2.128.733-4.577 1.636-6.49 2.222-1.385.424-2.129 1.488-1.895 2.709.28 1.455.952 4.417 1.83 6.945.39.141 1.764.55 3.327.973 1.579.426 3.013.784 3.123.784.148 0 .546-1.57.546-1.57 2.193.364 3.993.435 5.597-.101.996-.333 1.94-.853 2.766-1.564 1.597-1.378 1.986-2.585 2.213-3.693.36-1.745.86-5.83.86-5.83l.004-.002c.07-.464-.093-.974-.537-1.375-.729-.658-1.428-1.127-1.428-1.127-.512-.34-.847-.58-1.12-.651zm-5.462 8.784c-1.802 1.427-4.636 1.455-6.52.28-1.45-1.18-.737-3.79-.737-3.79s2.44-.805 4.398-1.442c2.096-.682 3.826-1.2 3.826-1.2.774 2.502.835 4.725-.967 6.152z"/>
      </svg>
    );
  }

  if (t.includes('liquid')) {
    return (
      <svg viewBox="0 0 24 24" fill="#5A80F1" height="24" width="24" title="Liquid">
        <path d="M12 2L2 22h20L12 2zm0 4.5L19.2 19H4.8L12 6.5z"/>
      </svg>
    );
  }
  
  if (t.includes('react')) {
    return (
      <svg viewBox="-11.5 -10.23174 23 20.46348" height="24" width="24" title="React">
        <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
        <g stroke="#61dafb" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    );
  }

  if (t.includes('next')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24" title="Next.js">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.602 16.598l-5.632-7.278v6.786h-1.43v-8.87h1.442l5.05 6.556v-6.556h1.431v8.87 /" fill="currentColor"/>
        <path d="M18.602 16.598l-5.632-7.278v6.786h-1.43V7.728h1.442l5.05 6.556v-6.556h1.43v8.87z" fill="currentColor" />
      </svg>
    );
  }

  if (t.includes('premiere')) {
    return (
      <svg viewBox="0 0 24 24" fill="#00005c" height="24" width="24" title="Adobe Premiere">
        <rect width="24" height="24" rx="4" fill="#00005c"/>
        <text x="5" y="16" fill="#9999ff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Pr</text>
      </svg>
    );
  }

  if (t.includes('after effects')) {
    return (
      <svg viewBox="0 0 24 24" fill="#00005c" height="24" width="24" title="Adobe After Effects">
        <rect width="24" height="24" rx="4" fill="#00005c"/>
        <text x="5" y="16" fill="#d199ff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Ae</text>
      </svg>
    );
  }

  if (t.includes('premiere') || t.includes('after effects') || t.includes('adobe') || t.includes('photoshop') || t.includes('illustrator')) {
    return (
      <svg viewBox="0 0 24 24" fill="#FF2200" height="24" width="24" title="Adobe">
        <path d="M13.9 2h9.6v20h-9.6zM0 2h9.6v20H0zm10.1 0h3.8v20h-3.8z"/>
      </svg>
    );
  }

  if (t.includes('python')) {
    return (
      <svg viewBox="0 0 24 24" fill="#3776AB" height="24" width="24" title="Python">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32L17 1.4l.22.2.14.34v.58l-1.05.02-3.14.01-4.73.01H7.22l-.21.13-.1.21-.01.55v4.54H4.72l-.7.05-.62.1-.5.17-.4.21-.3.26-.2.3-.12.35-.05.41v1.6l.04.48.13.43.2.35.29.3.37.24.46.16.55.1.66.04h5v-1.74l.01-1.37.04-.63.09-.54.16-.44.24-.35.33-.28.42-.23.53-.16.63-.1h5l.23-.01.21-.11.13-.2.02-.68V5l-.04-.5-.12-.4-.2-.3-.29-.22-.38-.15-.47-.1-.58-.04-1.25-.01h-2.1l-.01-1.63L14.25.18z"/>
      </svg>
    );
  }

  if (t.includes('node')) {
    return (
      <svg viewBox="0 0 24 24" fill="#339933" height="24" width="24" title="Node.js">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.93V14.5c0-.28-.22-.5-.5-.5H8.5c-.28 0-.5-.22-.5-.5v-1.5c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v1c0 .28.22.5.5.5h1.5c.28 0 .5-.22.5-.5v-2.5c0-.28-.22-.5-.5-.5H11c-.55 0-1-.45-1-1V9.5c0-.55.45-1 1-1h2.5c.28 0 .5.22.5.5v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5.22-.5.5v1c0 .28.22.5.5.5H15c.55 0 1 .45 1 1v2.5c0 .55-.45 1-1 1h-2.5c-.28 0-.5-.22-.5-.5z"/>
      </svg>
    );
  }

  if (t.includes('js') || t.includes('javascript')) {
    return (
      <svg viewBox="0 0 24 24" fill="#F7DF1E" height="24" width="24" title="JavaScript">
        <rect width="24" height="24" fill="#F7DF1E"/>
        <path d="M24 24h-6v-6h6z" fill="#000"/>
        <text x="14" y="22" fill="#000" fontSize="8" fontWeight="bold" fontFamily="sans-serif">JS</text>
      </svg>
    );
  }

  if (t.includes('css')) {
    return (
      <svg viewBox="0 0 24 24" fill="#1572B6" height="24" width="24" title="CSS">
        <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm14.5 6H8v2h8v-2zm-8 4h8l-.4 4.5-4 1.3-4-1.3-.3-3H6.8l.2 2 3 .9 3-.9.2-2.2H8v-2.8z"/>
      </svg>
    );
  }

  if (t.includes('html')) {
    return (
      <svg viewBox="0 0 24 24" fill="#E34F26" height="24" width="24" title="HTML">
        <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm16.5 6H6v3h12v-3zm-12 5h12l-.4 4.5-4.1 1.4-4.1-1.4L7.5 11z"/>
      </svg>
    );
  }

  if (t.includes('woocomerce') || t.includes('woocommerce')) {
    return (
      <svg viewBox="0 0 24 24" fill="#96588A" height="24" width="24" title="WooCommerce">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .28-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h2c.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5h-2c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h3c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5h-2c-.28 0-.5.22-.5.5v1c0 .28.22.5.5.5h2c.55 0 1 .45 1 1v2z"/>
      </svg>
    );
  }

  // Generic Stack Icon
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24" title={techName}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  );
}
