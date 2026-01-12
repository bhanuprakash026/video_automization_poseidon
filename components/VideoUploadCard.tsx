"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, X, FileVideo, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ACCEPTED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
];

interface VideoUploadCardProps {
    onProcess?: (videoId: string) => void;
}

export const VideoUploadCard = ({ onProcess }: VideoUploadCardProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [videoId, setVideoId] = useState<string | null>(null);

    const { toast } = useToast();

    const previewUrl = file ? URL.createObjectURL(file) : null;

    /* Cleanup preview URL */
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    /* Validate file */
    const validateFile = (file: File): string | null => {
        if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
            return "Invalid file type. Please upload MP4, WebM, MOV, or AVI files.";
        }
        if (file.size > MAX_FILE_SIZE) {
            return `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)
                }MB.`;
        }
        return null;
    };

    /* Handle file selection */
    const handleFile = useCallback((selectedFile: File) => {
        const validationError = validateFile(selectedFile);
        if (validationError) {
            setError(validationError);
            setFile(null);
            return;
        }

        setError(null);
        setFile(selectedFile);
        setIsUploaded(false);
        setVideoId(null);
        setUploadProgress(0);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragActive(false);
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) handleFile(droppedFile);
        },
        [handleFile]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFile(selectedFile);
        },
        [handleFile]
    );

    const handleRemoveFile = () => {
        setFile(null);
        setError(null);
        setIsUploaded(false);
        setVideoId(null);
        setUploadProgress(0);
    };

    const handleSubmit = async () => {
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/videos/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();

            setVideoId(data.videoId);
            setUploadProgress(100);
            setIsUploaded(true);

            toast({
                title: "Upload successful",
                description: `${file.name} uploaded successfully.`,
            });
        } catch (err) {
            toast({
                title: "Upload failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes: number) =>
        bytes < 1024 * 1024
            ? `${(bytes / 1024).toFixed(1)} KB`
            : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

    /* ========================= UI ========================= */

    return (
        <div className="w-full max-w-xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Upload Video</h1>
                <p className="text-muted-foreground">
                    Upload a long-form video to generate short clips.
                </p>
            </div>

            {/* Drop zone */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragActive(true);
                }}
                onDragLeave={() => setIsDragActive(false)}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 transition cursor-pointer",
                    isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    error && "border-destructive"
                )}
            >
                <input
                    type="file"
                    accept={ACCEPTED_VIDEO_TYPES.join(",")}
                    onChange={handleInputChange}
                    disabled={isUploading || isUploaded}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="p-4 rounded-full bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium">
                        {isUploaded
                            ? "Video uploaded successfully"
                            : isDragActive
                                ? "Drop your video here"
                                : "Drag & drop your video"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {isUploaded ? "Ready for processing" : "or click to browse"}
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* File info */}
            {file && !error && (
                <div className="p-4 rounded-lg border bg-card space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <FileVideo className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {formatFileSize(file.size)}
                            </p>
                        </div>
                        {!isUploading && (
                            <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {isUploading && (
                        <div className="space-y-2">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-sm text-muted-foreground text-center">
                                Uploading… {uploadProgress}%
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Video Preview */}
            {previewUrl && (
                <div className="rounded-lg border bg-black overflow-hidden">
                    <video
                        src={previewUrl}
                        controls
                        className="w-full aspect-video object-contain"
                    />
                </div>
            )}

            {/* Action buttons */}
            {!isUploaded ? (
                <Button
                    onClick={handleSubmit}
                    disabled={!file || isUploading || !!error}
                    className="w-full"
                    size="lg"
                >
                    {isUploading ? "Uploading..." : "Upload Video"}
                </Button>
            ) : (
                <Button
                    onClick={() => videoId && onProcess?.(videoId)}
                    className="w-full"
                    size="lg"
                    variant="secondary"
                >
                    Generate Clips
                </Button>
            )}
        </div>
    );
};
