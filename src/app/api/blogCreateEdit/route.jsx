import mongoose from "mongoose";
import { NextResponse } from 'next/server'
import Media from "../../../utils/models/media";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(request) {
    try {
        await connectMongoDB();

        const formData = await request.formData()
        const imageSrc = formData.get('imageSrc')
        const form_title = formData.get('title')
        const paragraph = formData.get('paragraph')
        const form_tags = formData.get('tags')
        const form_category = formData.get('category')
        const form_content = formData.get('content')
        const form_type = formData.get('type')
        const form_id = formData.get('id')

        const category = new mongoose.Types.ObjectId(form_category);
        const tags = form_tags.split(',').map(str => new mongoose.Types.ObjectId(str));

        var res;
        if (form_type == "create") {
            res = new Media({
                title: form_title,
                paragraph: paragraph,
                imageSrc: imageSrc,
                content: form_content,
                tags: tags,
                category: category,
                isActive: false,
            });
        } else {
            res = await Media.findById(form_id);
            if (res) {
                res.title = form_title;
                res.paragraph = paragraph;
                res.imageSrc = imageSrc;
                res.content = form_content;
                res.tags = tags;
                res.category = category;
            }
        }
        await res.save();

        return NextResponse.json({ data: res });
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json(error)
        // NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
