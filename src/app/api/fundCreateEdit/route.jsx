import mongoose from "mongoose";
import { NextResponse } from 'next/server'
import Fund from "../../../utils/models/fund";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(request) {
    try {
        await connectMongoDB();

        const formData = await request.formData()
        const title = formData.get('title')
        const logo = formData.get('logo')
        const form_websites = formData.get('websites')
        const location = formData.get('location')
        const form_areas = formData.get('areas')
        const form_stages = formData.get('stages')
        const summary = formData.get('summary')
        const form_type = formData.get('type')
        const form_id = formData.get('id')

        const websites = form_websites.split(',');
        const areas = form_areas.split(',').map(str => new mongoose.Types.ObjectId(str));
        const stages = form_stages.split(',').map(str => new mongoose.Types.ObjectId(str));

        var res;
        if (form_type == "create") {
            res = new Fund({
                title: title,
                logo: logo,
                location: location,
                websites: websites,
                areas: areas,
                stages: stages,
                summary: summary,
                isActive: false,
            });
        } else {
            res = await Fund.findById(form_id);
            if (res) {
                res.title = title;
                res.logo = logo;
                res.location = location;
                res.websites = websites;
                res.areas = areas;
                res.stages = stages;
                res.summary = summary;
            }
        }
        await res.save();

        return NextResponse.json({ data: formData });
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json(error)
        // NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
