import { Event } from "@/database";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (error) {
            return NextResponse.json({ message: "Invalid JSON data format", error }, { status: 400 });
        }

        const file = formData.get("image") as File;
        if(!file) return NextResponse.json({ message: "File not provided" }, { status: 400 });
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "image", folder: "DevEvent" }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(buffer);
        })

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const tags = JSON.parse(formData.get("tags") as string);
        const agenda = JSON.parse(formData.get("agenda") as string);

        const createdEvent = await Event.create({
            ...event,
            tags,
            agenda
        });

        return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to create event", error: error instanceof Error ? error.message : error }, { status: 500 });
    }
}

export async function GET() { 
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch events", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}