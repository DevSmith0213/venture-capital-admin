import mongoose from "mongoose";
import { NextResponse } from 'next/server'
import Area from "../../../utils/models/area";
import Stage from "../../../utils/models/stage";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { title, route } = await req.json();
    try {
        await connectMongoDB();
        
        var createdData;
        if (route == "area") {
            createdData = new Area({
                title: title,
                isActive: true,
            });
        } else if (route == "stage") {
            createdData = new Stage({
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
