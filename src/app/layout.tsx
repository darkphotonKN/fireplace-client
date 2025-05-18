import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import UserProfile from '@/components/UserProfile';
import Logo from '@/components/Logo';
import Link from 'next/link';

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: 'Flow - Your Learning & Development Hub',
  description:
    'Organize your learning journey and development projects in one place',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={merriweather.variable}>
      <body className={merriweather.className}>
        <div className="min-h-screen bg-layout">
          {/* Layout with sidebar */}
          <div className="flex">
            <Sidebar />

            {/* Main content */}
            <div className="w-full">
              {/* Top bar with logo and user profile */}
              <div className="fixed top-0 left-0 right-0 h-16 bg-layout backdrop-blur-sm z-10">
                <div className="h-full max-w-7xl mx-auto px-8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Logo />
                    <Link href="/">
                      <h1 className="text-2xl font-bold">Fireplace</h1>
                    </Link>
                  </div>
                  <UserProfile />
                </div>
              </div>

              {/* Main content with top padding to accommodate the top bar */}
              <main className="pt-20 p-8">
                <div className="max-w-7xl mx-auto">{children}</div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
