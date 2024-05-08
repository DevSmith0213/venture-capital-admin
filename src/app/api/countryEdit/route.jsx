import { NextResponse } from 'next/server'
import Country from "../../../utils/models/country";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(request) {
    try {
        await connectMongoDB();

        const formData = await request.formData()
        const form_type = formData.get('type')
        const form_id = formData.get('id')

        var res;
        if (form_type == "create") {
            res = new Country({
                desc: formData.get('desc'),
                image: formData.get('image'),
                isActive: false,
            });
        } else {
            res = await Country.findById(form_id);
            if (res) {
                res.image = formData.get('image');
                res.desc = formData.get('desc');
            }
        }
        await res.save();

        return NextResponse.json(res);
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json(error)
        // NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
