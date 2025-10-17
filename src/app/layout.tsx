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
  title: "GymBee - A Primeira Plataforma de Matching Fitness do Brasil",
    description:
      "Conecte-se com pessoas da sua academia que treinam no mesmo horário e têm objetivos similares. Algoritmo inteligente que analisa perfil, localização e preferências para encontrar sua dupla ideal. Treine melhor, evolua mais rápido!",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/images/logo-gymbee.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/images/logo-gymbee.svg", sizes: "180x180" },
    ],
  },
  keywords: [
    "parceiros de treino",
    "encontrar dupla de treino",
    "matching fitness brasil",
    "treino em dupla",
    "plataforma parceiros treino",
    "parceiro de treino",
    "conectar pessoas treino",
    "personal trainer online",
    "desafios diários fitness",
    "treino personalizado",
    "fitness matching",
    "treino social",
    "algoritmo fitness",
    "dupla musculação",
    "treino acompanhado",
    "plataforma digital fitness",
    "encontrar parceiro treino",
    "app fitness brasil",
    "treino inteligente",
    "comunidade fitness",
  ],
  openGraph: {
    title: "GymBee - A Primeira Plataforma de Matching Fitness do Brasil",
    description:
      "Conecte-se com pessoas da sua academia que treinam no mesmo horário e têm objetivos similares. Algoritmo inteligente que analisa perfil, localização e preferências para encontrar sua dupla ideal. Treine melhor, evolua mais rápido!",
    url: "https://gymbee.com.br",
    siteName: "GymBee",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "GymBee - App de Matching Fitness para Academia",
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
