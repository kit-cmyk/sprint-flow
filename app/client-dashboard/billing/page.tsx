"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Download, FileText, CheckCircle2, Clock } from "lucide-react"

const currentPlan = {
  name: "Growth Plan",
  price: "$12,500",
  period: "per sprint",
  includes: [
    "Dedicated 6-person pod",
    "Bi-weekly sprint cycles",
    "Priority support channel",
    "Weekly stakeholder sync",
  ],
}

const invoices = [
  { id: "INV-2026-014", date: "Feb 7, 2026", amount: "$12,500.00", status: "paid", sprint: "Sprint 14" },
  { id: "INV-2026-013", date: "Jan 24, 2026", amount: "$12,500.00", status: "paid", sprint: "Sprint 13" },
  { id: "INV-2026-012", date: "Jan 10, 2026", amount: "$12,500.00", status: "paid", sprint: "Sprint 12" },
  { id: "INV-2026-011", date: "Dec 27, 2025", amount: "$12,500.00", status: "paid", sprint: "Sprint 11" },
  { id: "INV-2026-010", date: "Dec 13, 2025", amount: "$15,000.00", status: "paid", sprint: "Sprint 10" },
  { id: "INV-2026-015", date: "Feb 21, 2026", amount: "$12,500.00", status: "pending", sprint: "Sprint 15" },
]

export default function ClientBillingPage() {
  return (
    <main className="flex-1 px-4 py-6 pt-16 sm:px-6 sm:pt-8 lg:px-10">
      <div className="mx-auto max-w-[900px]">
        <h1 className="text-2xl font-bold text-[hsl(220,15%,15%)]">Billing & Invoices</h1>
        <p className="mt-1 text-sm text-[hsl(220,10%,46%)]">
          Manage your plan and view past invoices.
        </p>

        {/* Current plan */}
        <Card className="mt-8 border-[hsl(220,13%,90%)] bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[hsl(160,51%,42%)]" />
                  <h2 className="text-lg font-semibold text-[hsl(220,15%,15%)]">{currentPlan.name}</h2>
                </div>
                <p className="mt-1 text-sm text-[hsl(220,10%,46%)]">
                  <span className="text-2xl font-bold text-[hsl(220,15%,15%)]">{currentPlan.price}</span>{" "}
                  {currentPlan.period}
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg border border-[hsl(220,13%,87%)] px-4 py-2 text-sm font-medium text-[hsl(220,10%,42%)] transition-colors hover:bg-[hsl(210,15%,95%)]"
              >
                Contact to modify
              </button>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {currentPlan.includes.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-[hsl(220,10%,42%)]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[hsl(160,51%,42%)]" />
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment method */}
        <Card className="mt-4 border-[hsl(220,13%,90%)] bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-16 items-center justify-center rounded-md bg-[hsl(210,15%,95%)] text-xs font-bold text-[hsl(220,10%,42%)]">
                VISA
              </div>
              <div>
                <p className="text-sm font-medium text-[hsl(220,15%,15%)]">Visa ending in 4242</p>
                <p className="text-xs text-[hsl(220,10%,55%)]">Expires 08/2027</p>
              </div>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-[hsl(160,51%,42%)] hover:underline"
            >
              Update
            </button>
          </CardContent>
        </Card>

        {/* Invoices */}
        <h2 className="mt-10 text-lg font-semibold text-[hsl(220,15%,15%)]">Invoice History</h2>
        <p className="mt-1 mb-4 text-sm text-[hsl(220,10%,46%)]">Download past invoices for your records.</p>

        <Card className="border-[hsl(220,13%,90%)] bg-white shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[hsl(220,13%,93%)]">
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-[hsl(220,10%,55%)] sm:px-5">Invoice</th>
                    <th className="hidden px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[hsl(220,10%,55%)] sm:table-cell">Sprint</th>
                    <th className="hidden px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[hsl(220,10%,55%)] md:table-cell">Date</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-[hsl(220,10%,55%)] sm:px-5">Amount</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-[hsl(220,10%,55%)] sm:px-5">Status</th>
                    <th className="px-3 py-3 sm:px-5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(220,13%,95%)]">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="transition-colors hover:bg-[hsl(210,15%,98%)]">
                      <td className="px-3 py-3.5 sm:px-5">
                        <div className="flex items-center gap-2">
                          <FileText className="hidden h-4 w-4 text-[hsl(220,10%,60%)] sm:block" />
                          <span className="font-medium text-[hsl(220,15%,15%)]">{inv.id}</span>
                        </div>
                      </td>
                      <td className="hidden px-5 py-3.5 text-[hsl(220,10%,42%)] sm:table-cell">{inv.sprint}</td>
                      <td className="hidden px-5 py-3.5 text-[hsl(220,10%,42%)] md:table-cell">{inv.date}</td>
                      <td className="px-3 py-3.5 font-medium text-[hsl(220,15%,15%)] sm:px-5">{inv.amount}</td>
                      <td className="px-3 py-3.5 sm:px-5">
                        {inv.status === "paid" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(160,51%,42%)]/10 px-2.5 py-0.5 text-xs font-medium text-[hsl(160,51%,36%)]">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 sm:px-5">
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-xs font-medium text-[hsl(160,51%,42%)] hover:underline"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
