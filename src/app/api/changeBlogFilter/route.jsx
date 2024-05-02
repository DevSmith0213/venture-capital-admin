import mongoose from "mongoose";
import { NextResponse } from 'next/server'
import Category from "../../../utils/models/category";
import Tag from "../../../utils/models/tag";
import Media from "../../../utils/models/media";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { id, route, type } = await req.json();
    try {
        await connectMongoDB();
        var updatedData;
        if(type=="change"){
            if (route == "category") {
                updatedData = await Category.findById(new mongoose.Types.ObjectId(id));
            } else if (route == "tag") {
                updatedData = await Tag.findById(new mongoose.Types.ObjectId(id));
            } else if (route == "blog") {
                updatedData = await Media.findById(new mongoose.Types.ObjectId(id));
            }
            updatedData.isActive = !updatedData.isActive;
            await updatedData.save();
        }else if(type=="remove"){
            if (route == "category") {
                updatedData = await Category.findByIdAndDelete(new mongoose.Types.ObjectId(id));
            } else if (route == "tag") {
                updatedData = await Tag.findByIdAndDelete(new mongoose.Types.ObjectId(id));
            } else if (route == "blog") {
                updatedData = await Media.findByIdAndDelete(new mongoose.Types.ObjectId(id));
            }
        }
        return NextResponse.json(updatedData);
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
