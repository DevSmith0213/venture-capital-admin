import { NextResponse } from 'next/server'
import Startup from "../../../utils/models/startup";
import Area from "../../../utils/models/area";
import Stage from "../../../utils/models/stage";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { route, currentPage, perPage } = await req.json();
    try {
        await connectMongoDB();
        const skip = (currentPage - 1) * perPage;
        var infos;
        var dataLength;

        var infos = await Startup.find()
            .sort({ title: 1 })
            .populate([
                {
                    path: "areasList",
                    model: Area,
                    options: { strictPopulate: false },
                },
                {
                    path: "stageList",
                    model: Stage,
                    options: { strictPopulate: false },
                }
            ])
            .skip(skip)
            .limit(perPage);
        var dataLength = await Startup.countDocuments();

        return NextResponse.json({ infos, dataLength });
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
