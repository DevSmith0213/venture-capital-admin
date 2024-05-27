import { NextResponse } from 'next/server'
import Pitch from "../../../utils/models/pitch";
import Area from "../../../utils/models/area";
import Stage from "../../../utils/models/stage";
import Fund from "../../../utils/models/fund";
import Startup from "../../../utils/models/startup";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { currentPage, perPage } = await req.json();
    try {
        await connectMongoDB();
        const skip = (currentPage - 1) * perPage;
        const pitches = await Pitch.find().skip(skip).limit(perPage);
        var infos = [];
        for (const pitch of pitches) {
            const fund = await Fund.findById(pitch.fund_id).exec();
            const startup = await Startup.findById(pitch.startup_id).populate([
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
            ]);
            infos.push({
                ...pitch.toObject(),
                startup: startup ? startup.toObject() : null,
                fund: fund ? fund.toObject() : null,
            });
        }
        var dataLength = await Pitch.countDocuments();

        return NextResponse.json({ infos, dataLength });
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
