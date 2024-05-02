import { NextResponse } from 'next/server'
import Category from "../../../utils/models/category";
import Tag from "../../../utils/models/tag";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { title, route } = await req.json();
    try {
        await connectMongoDB();
        
        var createdData;
        if (route == "category") {
            createdData = new Category({
                title: title,
                isActive: true,
            });
        } else if (route == "tag") {
            createdData = new Tag({
                title: title,
                isActive: true,
            });
        }

        await createdData.save();
        return NextResponse.json(createdData);
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
