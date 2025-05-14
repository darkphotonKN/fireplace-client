import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import UserProfile from '@/components/UserProfile';

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

            {/* Main content with left margin to accommodate sidebar */}
            <div className="ml-64 w-full">
              <div className="absolute top-4 right-8">
                <UserProfile />
              </div>
              {/* Main content */}
              <main className="p-8">
                <div className="max-w-7xl mx-auto">{children}</div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
