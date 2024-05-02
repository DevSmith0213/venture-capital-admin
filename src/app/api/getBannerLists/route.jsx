import { NextResponse } from 'next/server'
import Banner from "../../../utils/models/banner";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    try {
        await connectMongoDB();
        const banners = await Banner.find();

        return NextResponse.json(banners);
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
