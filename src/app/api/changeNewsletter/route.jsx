import mongoose from "mongoose";
import { NextResponse } from 'next/server'
import NewsLetter from "../../../utils/models/newsletter";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { id, type } = await req.json();
    try {
        await connectMongoDB();
        var updatedData;
        if (type == "change") {
            updatedData = await NewsLetter.findById(new mongoose.Types.ObjectId(id));
            updatedData.isActive = !updatedData.isActive;
            await updatedData.save();
        } else if (type == "remove") {
            updatedData = await NewsLetter.findByIdAndDelete(new mongoose.Types.ObjectId(id));
        }
        return NextResponse.json(updatedData);
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
