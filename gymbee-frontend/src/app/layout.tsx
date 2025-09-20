import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GymBee - Comunidade Fitness Online",
  description:
    "A GymBee é a comunidade fitness que conecta pessoas, treinos e personal trainers em um só lugar. Encontre motivação, compartilhe experiências e alcance seus objetivos de forma mais leve.",
  keywords: [
    "fitness",
    "treino online",
    "comunidade fitness",
    "personal trainer",
    "exercícios",
    "saúde",
    "bem-estar",
    "academia online",
  ],
  openGraph: {
    title: "GymBee - Comunidade Fitness Online",
    description:
      "Conecte-se com pessoas, encontre treinos e receba dicas de personal trainers. Tudo isso em uma comunidade fitness feita para você.",
    url: "https://gymbee.com.br", // ajuste se o domínio já existir
    siteName: "GymBee",
    locale: "pt_BR",
    type: "website",
  },
  alternates: {
    canonical: "https://gymbee.com.br", // já garante a canonical pro SEO
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
