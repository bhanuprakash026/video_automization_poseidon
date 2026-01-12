export function ClipCard({ clip }: { clip: any }) {
    return (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition">
            <video
                src={clip.filePath}
                controls
                className="w-full aspect-video bg-black"
            />
            <div className="p-4 space-y-1">
                <h3 className="font-medium">
                    {clip.title || "Untitled Clip"}
                </h3>
                <p className="text-xs text-slate-500">
                    {clip.orientation} • {clip.startTime}s – {clip.endTime}s
                </p>
            </div>
        </div>
    );
}
