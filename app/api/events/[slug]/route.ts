import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
    params: Promise<{ slug: string }>;
};

export async function GET( req: NextRequest, { params }: RouteParams ) {
    try {
        await connectDB();

        const { slug } = await params;
        if(!slug || typeof slug !== "string" || slug.trim() === "") return NextResponse.json({ message: "Invalid or missing slug" }, { status: 400 });

        const slugTrimmed = slug.trim().toLowerCase();
        const event = await Event.findOne({ slug: slugTrimmed }).lean(); 

        if (!event) {
            return NextResponse.json({ message: `Event with slug ${slugTrimmed} not found` }, { status: 404 });
        }

        return NextResponse.json({ message: "Event fetched successfully", event }, { status: 200 });
    } catch (error) {
        console.error("Error fetching event by slug:", error);
        return NextResponse.json({ message: "Failed to fetch event" }, { status: 500 });
    }
}