import { NextResponse } from 'next/server'
import Country from "../../../utils/models/country";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    try {
        await connectMongoDB();
        const country = await Country.find();

        return NextResponse.json(country);
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
