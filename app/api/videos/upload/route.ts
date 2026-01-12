import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: NextRequest) {

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = await path.join(process.cwd(), "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, file.name);
        await fs.writeFile(filePath, buffer);

        const video = await prisma.video.create({
            data: {
                filename: file.name,
                originalPath: filePath,
            }
        });

        return NextResponse.json({ videoId: video.id }, { status: 200 });
    } catch (error) {
        console.error("Error uploading video:", error);
        return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
    };
}