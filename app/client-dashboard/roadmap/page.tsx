import { RoadmapProgress } from "@/components/client/roadmap-progress"

export default function RoadmapPage() {
  return (
    <main className="flex-1 px-4 py-6 pt-16 sm:px-6 sm:pt-8 lg:px-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[hsl(220,15%,15%)]">
            Roadmap
          </h1>
          <p className="mt-0.5 text-sm text-[hsl(220,10%,46%)]">
            Track project phases and milestones
          </p>
        </div>

        <RoadmapProgress />
      </div>
    </main>
  )
}
