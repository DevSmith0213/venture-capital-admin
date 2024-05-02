import mongoose from "mongoose";
import { NextResponse } from 'next/server'
import Fund from "../../../utils/models/fund";
import Area from "../../../utils/models/area";
import Stage from "../../../utils/models/stage";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { id, route, type } = await req.json();
    try {
        await connectMongoDB();
        var updatedData;
        if (type == "change") {
            if (route == "stage") {
                updatedData = await Stage.findById(new mongoose.Types.ObjectId(id));
            } else if (route == "area") {
                updatedData = await Area.findById(new mongoose.Types.ObjectId(id));
            } else if (route == "vc" || route == "new-vc") {
                updatedData = await Fund.findById(new mongoose.Types.ObjectId(id));
            }
            updatedData.isActive = !updatedData.isActive;
            await updatedData.save();
        } else if (type == "remove") {
            if (route == "area") {
                updatedData = await Area.findByIdAndDelete(new mongoose.Types.ObjectId(id));
            } else if (route == "stage") {
                updatedData = await Stage.findByIdAndDelete(new mongoose.Types.ObjectId(id));
            } else if (route == "vc" || route == "new-vc") {
                updatedData = await Fund.findById(new mongoose.Types.ObjectId(id));
            }
        }
        return NextResponse.json(updatedData);
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
