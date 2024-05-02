import mongoose from "mongoose";
import { NextResponse } from 'next/server'
import Banner from "../../../utils/models/banner";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { id, type } = await req.json();
    try {
        await connectMongoDB();
        var updatedData;
        if(type=="change"){
            updatedData = await Banner.findById(new mongoose.Types.ObjectId(id));
            updatedData.isActive = !updatedData.isActive;
            await updatedData.save();
        }else if(type=="remove"){
            updatedData = await Banner.findByIdAndDelete(new mongoose.Types.ObjectId(id));
        }
        return NextResponse.json(updatedData);
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
