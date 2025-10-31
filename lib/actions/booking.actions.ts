"use server";

import { Booking } from "@/database";
import connectDB from "../mongodb";

export const createBooking = async ({ eventId, email, slug } : { eventId: string, email: string, slug: string }) => {
    try {
        await connectDB();
        await Booking.create({ eventId, email, slug });
        return { success: true };
    } catch (error) {
        console.error('Error creating booking:', error);
        return { success: false };
    }
}