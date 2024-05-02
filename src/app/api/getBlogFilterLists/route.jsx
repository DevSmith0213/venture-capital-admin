import { NextResponse } from 'next/server'
import Category from "../../../utils/models/category";
import Tag from "../../../utils/models/tag";
import { connectMongoDB } from "../../../utils/mongodb";

export async function GET(req) {
    try {
        await connectMongoDB();
        const categories = await Category.find();
        const tags = await Tag.find();

        return NextResponse.json({ tags, categories });
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
