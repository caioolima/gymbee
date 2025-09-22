import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { AuthProvider } from "@/hooks/useAuth";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GymBee - Onde Treino e Tecnologia Se Encontram",
  description:
    "A solução completa que vai transformar seus treinos. Gerencie treinos, encontre duplas, contrate personal trainers e acesse conteúdo especializado. Tudo em um só lugar. Comece grátis hoje.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  keywords: [
    "dupla de treino",
    "academia",
    "matching fitness",
    "treino em dupla",
    "Smart Fit",
    "World Gym",
    "Bio Ritmo",
    "academia inteligente",
    "parceiro de treino",
    "fitness",
    "treino",
    "exercícios",
    "saúde",
    "bem-estar",
    "personal trainer",
    "desafios diários",
    "dieta",
    "algoritmo de matching",
  ],
  openGraph: {
    title: "GymBee - Onde Treino e Tecnologia Se Encontram",
    description:
      "A solução completa que vai transformar seus treinos. Gerencie treinos, encontre duplas, contrate personal trainers e acesse conteúdo especializado. Tudo em um só lugar.",
    url: "https://gymbee.com.br",
    siteName: "GymBee",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "GymBee - Onde Treino e Tecnologia Se Encontram",
      },
    ],
  },  
  alternates: {
    canonical: "https://gymbee.com.br",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GymBee",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="pt-BR">
          <body className={`${poppins.variable} antialiased`}>
            <QueryProvider>
              <AuthProvider>
                {children}
                <PWAInstallPrompt />
                <Toaster 
                  position="bottom-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#1a1a1a',
                      color: '#fff',
                      border: '1px solid #333',
                    },
                    success: {
                      iconTheme: {
                        primary: '#fbbf24',
                        secondary: '#1a1a1a',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#1a1a1a',
                      },
                    },
                  }}
                />
              </AuthProvider>
            </QueryProvider>
          </body>
        </html>
  );
}
