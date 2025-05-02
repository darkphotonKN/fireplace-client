import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

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
        <div className="p-6 min-h-screen bg-layout">
          <h1 className="h-[80px]">Fireplace</h1>

          {/* Layout with sidebar */}
          <div className="flex">
            <Sidebar />

            {/* Main content with left margin to accommodate sidebar */}
            <main className="ml-64 w-full">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
