import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Cup 2026 Prediction Challenge — Predict & Win",
  description: "Enter for €1. Predict World Cup match scores, earn points, and win real cash prizes. 3,847 players already entered. Join now.",
  openGraph: {
    title: "World Cup 2026 Prediction Challenge",
    description: "Enter for €1. Predict World Cup match scores, earn points, and win real cash prizes.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
