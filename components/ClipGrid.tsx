import { ClipCard } from "./ClipCard";

export function ClipGrid({ clips }: { clips: any[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clips.map((clip) => (
                <ClipCard key={clip.id} clip={clip} />
            ))}
        </div>
    );
}
