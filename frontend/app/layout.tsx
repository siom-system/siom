import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SionDataProvider } from "@/context/SionDataProvider"; // <-- NOSSA IMPORTAÇÃO

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIOM",
  description: "Sistema Integrado de Operações de Mercado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* A MUDANÇA ESTÁ AQUI: ENVOLVEMOS TUDO COM O PROVEDOR DE DADOS */}
          <SionDataProvider>
            {children}
          </SionDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}