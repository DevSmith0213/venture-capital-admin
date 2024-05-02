import { NextResponse } from 'next/server'
import Category from "../../../utils/models/category";
import Tag from "../../../utils/models/tag";
import Media from "../../../utils/models/media";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { route, currentPage, perPage } = await req.json();
    try {
        await connectMongoDB();
        const skip = (currentPage - 1) * perPage;
        var data;
        var dataLength;
        if (route == "category") {
            data = await Category.find()
                .skip(skip)
                .limit(perPage);
            dataLength = await Category.countDocuments();
        } else if (route == "tag") {
            data = await Tag.find()
                .skip(skip)
                .limit(perPage);
            dataLength = await Tag.countDocuments();
        } else if (route == "blog") {
            data = await Media.find()
                .sort({ title: 1 })
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
                ])
                .skip(skip)
                .limit(perPage);
            dataLength = await Media.countDocuments();
        }

        return NextResponse.json({ infos: data, dataLength });
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
