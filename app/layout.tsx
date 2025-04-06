import { Geist_Mono } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geistMono.className, "antialiased")}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
