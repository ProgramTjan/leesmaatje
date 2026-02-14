import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "LeesmaatJE - Oefenen met lezen",
  description: "Een leuke app voor kinderen om beter te leren lezen. Speciaal ontworpen voor kinderen met dyslexie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased theme-junior">
        <ThemeProvider>
          <div className="bubble-bg" />
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
