"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, Lock } from "lucide-react"

export default function ClientLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulated auth -- accepts any non-empty credentials
    await new Promise((r) => setTimeout(r, 800))

    if (!email || !password) {
      setError("Please enter your email and password.")
      setIsLoading(false)
      return
    }

    router.push("/client-dashboard")
  }

  return (
    <div className="client-portal flex min-h-screen">
      {/* Left panel -- brand / illustration */}
      <div className="hidden lg:flex lg:w-[480px] flex-col justify-between bg-[hsl(160,51%,42%)] p-10 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              className="text-white"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
              <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
              <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
              <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <span className="text-lg font-semibold">Assembled Systems</span>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold leading-tight text-balance">
            Track your project progress in real time
          </h2>
          <p className="text-base leading-relaxed text-white/80">
            Your dedicated portal for sprint updates, delivery milestones, and direct communication with your development team.
          </p>
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
              <span>Live sprint progress and outcomes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
              <span>Roadmap visibility and milestone tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
              <span>Invoices and billing management</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/50">
          Assembled Systems &copy; 2026. All rights reserved.
        </p>
      </div>

      {/* Right panel -- login form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[hsl(0,0%,98%)] px-6 py-12">
        {/* Mobile brand header */}
        <div className="mb-10 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(160,51%,42%)]/10">
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              className="text-[hsl(160,51%,42%)]"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
              <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
              <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
              <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <span className="text-base font-semibold text-[hsl(220,15%,15%)]">Assembled Systems</span>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(160,51%,42%)]/10">
              <Lock className="h-5 w-5 text-[hsl(160,51%,42%)]" />
            </div>
            <h1 className="text-2xl font-bold text-[hsl(220,15%,15%)]">
              Client Portal
            </h1>
            <p className="mt-1.5 text-sm text-[hsl(220,10%,46%)]">
              Sign in to view your project dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[hsl(220,15%,15%)]">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-[hsl(220,13%,87%)] bg-white px-3.5 text-sm text-[hsl(220,15%,15%)] placeholder:text-[hsl(220,10%,70%)] outline-none transition-colors focus:border-[hsl(160,51%,42%)] focus:ring-2 focus:ring-[hsl(160,51%,42%)]/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-[hsl(220,15%,15%)]">
                  Password
                </label>
                <button type="button" className="text-xs font-medium text-[hsl(160,51%,42%)] hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-11 w-full rounded-lg border border-[hsl(220,13%,87%)] bg-white px-3.5 pr-10 text-sm text-[hsl(220,15%,15%)] placeholder:text-[hsl(220,10%,70%)] outline-none transition-colors focus:border-[hsl(160,51%,42%)] focus:ring-2 focus:ring-[hsl(160,51%,42%)]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,60%)] hover:text-[hsl(220,15%,30%)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-11 items-center justify-center gap-2 rounded-lg bg-[hsl(160,51%,42%)] text-sm font-semibold text-white transition-colors hover:bg-[hsl(160,51%,36%)] disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[hsl(220,10%,60%)]">
            {"Don't have access? Contact your project manager to receive login credentials."}
          </p>
        </div>
      </div>
    </div>
  )
}
