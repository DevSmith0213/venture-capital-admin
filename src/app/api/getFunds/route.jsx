import { NextResponse } from 'next/server'
import Fund from "../../../utils/models/fund";
import Area from "../../../utils/models/area";
import Stage from "../../../utils/models/stage";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { route } = await req.json();
    try {
        await connectMongoDB();
        const fund = await Fund.findOne({ route }).populate([
            {
                path: "areas",
                model: Area,
                options: { strictPopulate: false },
            },
            {
                path: "stages",
                model: Stage,
                options: { strictPopulate: false },
            }
        ]);

        return NextResponse.json(fund);
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
