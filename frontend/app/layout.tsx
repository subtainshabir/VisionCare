import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ThemeProvider } from "@/lib/theme/theme-context";

export const metadata: Metadata = {
  title: "VisionCare - Digital Vision Screening",
  description:
    "Accessible browser-based vision screening demonstrations to test color perception, distance acuity, and close reading clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('visioncare_theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&d)){document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#090D16] text-[#173B45] dark:text-[#F8FAFC] transition-colors duration-150 antialiased selection:bg-teal-500/25 selection:text-teal-900 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-teal-600 focus:text-white dark:focus:bg-cyan-500 dark:focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-xl focus:ring-2 focus:ring-teal-400 dark:focus:ring-cyan-300 focus:outline-none"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
