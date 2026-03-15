"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Download,
  CreditCard,
  FileText,
  Eye,
  ChevronDown,
  Check,
  Building2,
} from "lucide-react"
import type { PodData } from "@/lib/pod-data"

const paymentMethods = [
  {
    id: "visa",
    label: "Visa ending in 4242",
    brand: "Visa",
    last4: "4242",
    expiry: "09/27",
  },
  {
    id: "mastercard",
    label: "Mastercard ending in 8811",
    brand: "Mastercard",
    last4: "8811",
    expiry: "03/26",
  },
  {
    id: "ach",
    label: "ACH - Chase Business ****6190",
    brand: "ACH",
    last4: "6190",
    expiry: "",
  },
]

const invoices = [
  {
    id: "INV-2025-014",
    date: "Feb 1, 2025",
    amount: "$10,995.00",
    status: "current" as const,
  },
  {
    id: "INV-2025-013",
    date: "Jan 1, 2025",
    amount: "$10,995.00",
    status: "paid" as const,
  },
  {
    id: "INV-2024-012",
    date: "Dec 1, 2024",
    amount: "$10,995.00",
    status: "paid" as const,
  },
  {
    id: "INV-2024-011",
    date: "Nov 1, 2024",
    amount: "$10,995.00",
    status: "paid" as const,
  },
  {
    id: "INV-2024-010",
    date: "Oct 1, 2024",
    amount: "$10,995.00",
    status: "paid" as const,
  },
  {
    id: "INV-2024-009",
    date: "Sep 1, 2024",
    amount: "$10,995.00",
    status: "paid" as const,
  },
]

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/15 text-emerald-400",
  current: "bg-blue-500/15 text-blue-400",
  overdue: "bg-red-500/15 text-red-400",
}

export function PodBilling({ pod }: { pod: PodData }) {
  const [selectedPayment, setSelectedPayment] = useState("visa")
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false)

  const currentPayment = paymentMethods.find((p) => p.id === selectedPayment)

  return (
    <section>
      {/* Subscription card */}
      <Card className="mb-6 border-border bg-card">
        <CardContent className="p-0">
          <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Plan info */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                <Building2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Active Subscription
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  {pod.name}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Dedicated development pod &middot; Monthly billing
                </p>
              </div>
            </div>
            {/* Price */}
            <div className="text-left lg:text-right">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                $10,995
              </p>
              <p className="text-sm text-muted-foreground">per month</p>
              <span className="mt-2 inline-block rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                Active
              </span>
            </div>
          </div>
          <div className="border-t border-border px-6 py-3">
            <div className="flex flex-wrap gap-x-8 gap-y-1 text-xs text-muted-foreground">
              <span>
                Billing cycle:{" "}
                <span className="font-medium text-foreground">
                  1st of each month
                </span>
              </span>
              <span>
                Payment terms:{" "}
                <span className="font-medium text-foreground">Net 15</span>
              </span>
              <span>
                Next invoice:{" "}
                <span className="font-medium text-foreground">Mar 1, 2025</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment method */}
      <Card className="mb-6 border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Payment Method
              </h3>
              <p className="text-xs text-muted-foreground">
                Select the payment method for this subscription
              </p>
            </div>
          </div>

          <div className="relative mt-4">
            <button
              onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary px-4 py-3 text-left transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-background">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {currentPayment?.label}
                  </p>
                  {currentPayment?.expiry && (
                    <p className="text-xs text-muted-foreground">
                      Expires {currentPayment.expiry}
                    </p>
                  )}
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${paymentDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {paymentDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedPayment(method.id)
                      setPaymentDropdownOpen(false)
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {method.label}
                        </p>
                        {method.expiry && (
                          <p className="text-xs text-muted-foreground">
                            Expires {method.expiry}
                          </p>
                        )}
                      </div>
                    </div>
                    {method.id === selectedPayment && (
                      <Check className="h-4 w-4 text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoice history table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">
              Invoice History
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 border-border bg-secondary text-secondary-foreground hover:bg-muted"
            >
              <Download className="h-3 w-3" />
              Export All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-3 py-3 text-left font-medium sm:px-4">Invoice</th>
                  <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
                    Transaction Date
                  </th>
                  <th className="px-3 py-3 text-right font-medium sm:px-4">Amount</th>
                  <th className="px-3 py-3 text-left font-medium sm:px-4">Status</th>
                  <th className="px-4 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-3 sm:px-4">
                      <span className="flex items-center gap-2 font-medium text-foreground">
                        <FileText className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
                        {inv.id}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {inv.date}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-foreground sm:px-4">
                      {inv.amount}
                    </td>
                    <td className="px-3 py-3 sm:px-4">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[inv.status]}`}
                      >
                        {inv.status.charAt(0).toUpperCase() +
                          inv.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="sr-only">View {inv.id}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span className="sr-only">Download {inv.id}</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
