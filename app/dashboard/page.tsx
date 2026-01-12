import { ClipGrid } from "@/components/ClipGrid";
import { VideoPreview } from "@/components/VideoPreview";
import { EmptyState } from "@/components/EmptyState";

export default function DashboardPage() {
    const clips: any[] = []; // will come from API later

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <VideoPreview videoUrl="/sample.mp4" />

            {clips.length === 0 ? (
                <EmptyState />
            ) : (
                <ClipGrid clips={clips} />
            )}
        </div>
    );
}
