"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, ArrowRight, User } from "lucide-react"
import { resolveLoginRedirect } from "@/lib/auth-utils"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Validate callbackUrl is a relative path to prevent open-redirect attacks
  const rawCallback = searchParams.get("callbackUrl") ?? "/"
  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }

    setIsLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password.")
      setIsLoading(false)
      return
    }

    // Fetch the session to determine the role-based redirect
    const { getSession } = await import("next-auth/react")
    const session = await getSession()
    const role = session?.user?.globalRole ?? ""

    router.push(resolveLoginRedirect(role, callbackUrl))
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[520px] flex-col justify-between bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white" aria-hidden="true">
                <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
            <span className="text-xl font-bold">SPOT v2</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <h2 className="text-4xl font-bold leading-tight text-balance">
            Welcome to your executive command center
          </h2>
          <p className="text-lg leading-relaxed text-white/90">
            Monitor cross-pod performance, track delivery metrics, and gain AI-powered insights into your development operations.
          </p>
          <div className="flex flex-col gap-4 text-sm text-white/80">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span>Real-time sprint tracking across all pods</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <span>AI-powered risk detection and insights</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-purple-400" />
              <span>Developer capacity and velocity analytics</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-white/60">
          Assembled Systems &copy; 2026. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/10">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-purple-600" aria-hidden="true">
              <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
              <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
              <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
              <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
          <span className="text-lg font-bold text-foreground">SPOT v2</span>
        </div>

        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700">
              <User className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access the platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <button type="button" className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline">
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
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 transition-all hover:shadow-xl hover:shadow-purple-600/40 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              {"Don't have an account? "}
              <button type="button" className="font-medium text-purple-600 hover:text-purple-700 hover:underline">
                Contact your administrator
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
