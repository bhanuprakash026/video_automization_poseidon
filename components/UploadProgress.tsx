export function UploadProgress({ progress }: { progress: number }) {
    return (
        <div className="space-y-1">
            <div className="h-2 w-full rounded bg-slate-200">
                <div
                    className="h-2 rounded bg-indigo-600 transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-xs text-slate-500">{progress}% uploaded</p>
        </div>
    );
}
