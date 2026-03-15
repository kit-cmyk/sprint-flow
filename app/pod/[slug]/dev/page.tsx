import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPodBySlug, pods } from "@/lib/pod-data"
import { getDevelopersByPod } from "@/lib/developer-data"
import { DevPicker } from "@/components/developer/dev-picker"

export function generateStaticParams() {
  return pods.map((pod) => ({ slug: pod.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pod = getPodBySlug(slug)
  if (!pod) return { title: "Pod Not Found" }
  return {
    title: `${pod.name} Team | Assembled Systems`,
    description: `Developer workload dashboard for ${pod.name}`,
  }
}

export default async function DevPickerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pod = getPodBySlug(slug)
  if (!pod) notFound()

  const devs = getDevelopersByPod(slug)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-border px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href={`/pod/${slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 border-border bg-secondary text-secondary-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Return to Pod View</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-balance text-base font-semibold text-foreground md:text-lg">
              {pod.name} &ndash; Developer Drill Down
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {pod.sprint} &middot; {pod.client}
            </p>
          </div>
        </div>
      </div>
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <DevPicker developers={devs} podSlug={slug} />
      </main>
      <footer className="border-t border-border px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Assembled Systems v2.4.1</span>
          <span>Last synced: 2 min ago</span>
        </div>
      </footer>
    </div>
  )
}
