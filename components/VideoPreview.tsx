export function VideoPreview({ videoUrl }: { videoUrl: string }) {
    return (
        <div className="relative aspect-video w-full rounded-lg bg-black overflow-hidden">
            <video
                src={videoUrl}
                controls
                className="h-full w-full object-contain"
            />
        </div>
    );
}
