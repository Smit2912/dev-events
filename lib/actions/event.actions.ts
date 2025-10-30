"use server"

import { Event, IEvent } from "@/database";
import connectDB from "../mongodb"

export async function getSimilarEventsbySlug({ slug }: { slug: string }) {
    try {
        await connectDB();

        const event = await Event.findOne({ slug });

        return await Event.find({tags: { $in: event?.tags }, _id: { $ne: event?._id }}).lean<IEvent[]>();
    } catch {
        return []
    }
}