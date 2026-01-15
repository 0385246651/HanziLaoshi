import type { Metadata } from "next";
import { Spline_Sans, Noto_Sans } from "next/font/google";
import "./globals.css";

const splineSans = Spline_Sans({
  variable: "--font-spline",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "HSK Smart Test",
  description: "Web học tiếng Trung HSK 1-6",
};

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${splineSans.variable} ${notoSans.variable} font-display antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          <footer className="py-8 text-center">
            <p className="text-[10px] text-[#a19985] font-medium tracking-wide">
              @made by Hải Bá Bá 2025 with DungLaoshi class
            </p>
          </footer>

          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
