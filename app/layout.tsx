import { Geist } from 'next/font/google';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ViewProvider } from '@/app/contexts/ViewContext';
import { PlayerProvider } from '@/app/contexts/PlayerContext';
import "./globals.css";
import { PWAInstallPrompt } from './components/PWAInstallPrompt';


const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <AuthProvider>
          <ViewProvider>
            <PlayerProvider>
              <PWAInstallPrompt />
              {children}
            </PlayerProvider>
          </ViewProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
