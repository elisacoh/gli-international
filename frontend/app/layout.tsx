// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return children;
// }

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GLI International",
  description: "Professional training seminars worldwide for health professionals.",
  icons: {
    icon: '/logo-gli-without-text.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
