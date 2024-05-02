import { NextResponse } from 'next/server'
import Banner from "../../../utils/models/banner";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(request) {
    try {
        await connectMongoDB();

        const formData = await request.formData()
        const form_type = formData.get('type')
        const form_id = formData.get('id')

        var res;
        if (form_type == "create") {
            res = new Banner({
                link: formData.get('link'),
                image: formData.get('image'),
                isActive: false,
            });
        } else {
            res = await Banner.findById(form_id);
            if (res) {
                res.link = formData.get('link');
                res.image = formData.get('image');
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
