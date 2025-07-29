"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { AuthProvider } from "@/lib/auth-context"
import {
  BarChart3,
  Target,
  Shield,
  Activity,
  Settings,
  Zap,
  FileText,
  History,
  TrendingUp,
  Menu,
  X,
} from "lucide-react"

const navigation = [
  { name: "Dashboard Geral", href: "/", icon: BarChart3 },
  { name: "SIOM", href: "/siom", icon: TrendingUp },
  { name: "Ativos", href: "/ativos", icon: Target },
  { name: "Por Confiança", href: "/confianca", icon: Shield },
  { name: "Regimes de Mercado", href: "/regimes", icon: Activity },
  { name: "Gestão de Contexto", href: "/contexto", icon: Settings },
  { name: "Scanner de Volatilidade", href: "/scanner", icon: Zap },
  { name: "Narrativa Inteligente", href: "/narrativa", icon: FileText },
  { name: "Histórico de Sinais", href: "/historico", icon: History },
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Fechar sidebar ao navegar (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        {/* Sidebar Desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-800/50 px-6 pb-4 backdrop-blur-sm border-r border-slate-700/50">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-100">SIOM</h1>
                  <p className="text-xs text-slate-400">Sistema Inteligente</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 ${
                              isActive
                                ? "bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500"
                                : "text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50"
                            }`}
                          >
                            <item.icon
                              className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                                isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-400"
                              }`}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile sidebar */}
        <div className={`lg:hidden ${sidebarOpen ? "relative z-50" : ""}`}>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />

              {/* Sidebar */}
              <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-800/95 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-100">SIOM</h1>
                      <p className="text-xs text-slate-400">Sistema Inteligente</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-slate-400 hover:text-slate-300"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <nav className="mt-6">
                  <ul role="list" className="space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 ${
                              isActive
                                ? "bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500"
                                : "text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50"
                            }`}
                          >
                            <item.icon
                              className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                                isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-400"
                              }`}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </div>
            </>
          )}
        </div>

        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-slate-800/50 px-4 py-4 shadow-sm sm:px-6 lg:hidden backdrop-blur-sm border-b border-slate-700/50">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-slate-100">
            {navigation.find((item) => item.href === pathname)?.name || "SIOM"}
          </div>
        </div>

        {/* Main content */}
        <main className="lg:pl-72">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </AuthProvider>
  )
}
