import { NextResponse } from 'next/server'
import User from "../../../utils/models/user";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { currentPage, perPage } = await req.json();
    try {
        await connectMongoDB();
        const skip = (currentPage - 1) * perPage;

        var infos = await User.find().sort({ name: 1 }).skip(skip).limit(perPage);
        var dataLength = await User.countDocuments();

        return NextResponse.json({ infos, dataLength });
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
