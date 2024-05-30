import { NextResponse } from 'next/server'
import NewsLetter from "../../../utils/models/newsletter";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    try {
        await connectMongoDB();
        const country = await NewsLetter.find();

        return NextResponse.json(country);
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
