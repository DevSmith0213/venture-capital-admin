import { NextResponse } from 'next/server'
import Area from "../../../utils/models/area";
import Stage from "../../../utils/models/stage";
import { connectMongoDB } from "../../../utils/mongodb";

export async function GET() {
    try {
        await connectMongoDB();
        const areas = await Area.find({ isActive: true });
        const stages = await Stage.find({ isActive: true });
        
        return NextResponse.json({ areas, stages });
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
