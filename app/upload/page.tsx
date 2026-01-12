import { VideoUploadCard } from "@/components/VideoUploadCard";

export default function UploadPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Upload Video</h1>
            <VideoUploadCard />
        </div>
    );
}
