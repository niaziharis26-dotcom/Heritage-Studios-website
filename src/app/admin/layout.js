/**
 * Heritage Studios Admin Layout
 * Applies noindex/nofollow to ALL admin routes — they must never appear in search results.
 */

export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({ children }) {
  return children;
}