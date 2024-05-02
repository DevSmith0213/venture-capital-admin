import mongoose from "mongoose";
import { NextResponse } from 'next/server'
import Category from "../../../utils/models/category";
import Tag from "../../../utils/models/tag";
import Media from "../../../utils/models/media";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { id } = await req.json();
    try {
        await connectMongoDB();

        var filteredVcList = await Media.findById(new mongoose.Types.ObjectId(id))
            .populate([
                {
                    path: "category",
                    model: Category,
                    options: { strictPopulate: false },
                },
                {
                    path: "tags",
                    model: Tag,
                    options: { strictPopulate: false },
                }
            ]);

        return NextResponse.json(filteredVcList);
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
