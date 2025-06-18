import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Angecraft Portfolio",
  description: "Personal portfolio showcasing projects, blog, and dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}