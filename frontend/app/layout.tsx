import type React from "react"
import type { Metadata } from "next"
import SidebarClient from "./clientLayout"

export const metadata: Metadata = {
  title: "SIOM - Sistema Integrado de Operações de Mercado",
  description: "Dashboard de análise de mercado financeiro premium",
    generator: '.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <SidebarClient>{children}</SidebarClient>
      </body>
    </html>
  )
}


import './globals.css'