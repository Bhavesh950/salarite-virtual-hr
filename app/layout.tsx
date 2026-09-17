import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Salarite Virtual HR - AI-Powered Virtual HR & ATS Platform',
  description: 'Modern AI-powered Virtual HR and Applicant Tracking System for automated recruitment, interview scheduling, and HR operations.',
  openGraph: {
    title: 'Salarite Virtual HR - AI-Powered Virtual HR & ATS Platform',
    description: 'Modern AI-powered Virtual HR and Applicant Tracking System for automated recruitment, interview scheduling, and HR operations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salarite Virtual HR - AI-Powered Virtual HR & ATS Platform',
    description: 'Modern AI-powered Virtual HR and Applicant Tracking System for automated recruitment, interview scheduling, and HR operations.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
