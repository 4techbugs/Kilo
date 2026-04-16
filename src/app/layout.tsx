import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KreditBee - Personal Loans & Credit",
  description: "Get instant personal loans up to ₹4 Lakh. Quick approval, minimal documentation. Apply now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-gray-50`}>
        <AppProviders>
          <div className="app-container">
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
