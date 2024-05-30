import { NextResponse } from 'next/server'
import Category from "../../../utils/models/category";
import Tag from "../../../utils/models/tag";
import Fund from "../../../utils/models/fund";
import { connectMongoDB } from "../../../utils/mongodb";

export async function GET(req) {
    try {
        await connectMongoDB();
        const categories = await Category.find({ isActive: true });
        const tags = await Tag.find({ isActive: true });
        const funds = await Fund.find({ isActive: true });

        return NextResponse.json({ tags, categories, funds });
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
