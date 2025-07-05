"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import {
  BarChart3,
  TrendingUp,
  Coins,
  Shield,
  Activity,
  Settings,
  Zap,
  FileText,
  BookOpen,
  History,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
})

const navigationItems = [
  { name: "Dashboard Geral", href: "/", icon: BarChart3 },
  { name: "Dashboard Integrado", href: "/siom", icon: TrendingUp },
  { name: "Ativos", href: "/ativos", icon: Coins },
  { name: "Por Confiança", href: "/confianca", icon: Shield },
  { name: "Regimes de Mercado", href: "/regimes", icon: Activity },
  { name: "Gestão de Contexto", href: "/contexto", icon: Settings },
  { name: "Scanner de Volatilidade", href: "/scanner", icon: Zap },
  { name: "Narrativa Inteligente", href: "/narrativa", icon: FileText },
  { name: "Guia de Análises", href: "/guia", icon: BookOpen },
  { name: "Histórico", href: "/historico", icon: History },
]

function SidebarClient({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={`${inter.variable} font-sans bg-slate-950 text-slate-100 min-h-screen`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${isCollapsed ? "w-20" : "w-72"} bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800/50 transition-all duration-300 ease-in-out shadow-2xl`}
        >
          <div className="flex flex-col h-full">
            {/* Logo/Title */}
            <div className="p-6 border-b border-slate-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className={`${isCollapsed ? "opacity-0 w-0" : "opacity-100"} transition-all duration-300`}>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    SIOM
                  </h1>
                  <p className="text-sm text-slate-400 mt-1 font-light">Sistema Integrado de Operações</p>
                </div>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 hover:scale-105"
                >
                  {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <div key={item.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <a
                      href={item.href}
                      className={`group flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                          : "text-slate-300 hover:bg-slate-800/50 hover:text-emerald-400 hover:scale-[1.02] hover:shadow-lg"
                      }`}
                    >
                      <Icon
                        className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"} transition-all duration-200 group-hover:scale-110`}
                      />
                      <span
                        className={`${isCollapsed ? "opacity-0 w-0" : "opacity-100"} transition-all duration-300 truncate`}
                      >
                        {item.name}
                      </span>
                    </a>
                  </div>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800/50">
              <div className={`${isCollapsed ? "opacity-0" : "opacity-100"} transition-all duration-300`}>
                <div className="text-xs text-slate-500 text-center">
                  <p>© 2024 SIOM Platform</p>
                  <p className="mt-1">v2.1.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default SidebarClient
