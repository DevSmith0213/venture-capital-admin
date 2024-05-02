import { NextResponse } from 'next/server'
import Fund from "../../../utils/models/fund";
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
        if (route == "stage") {
            infos = await Stage.find()
                .skip(skip)
                .limit(perPage);
            dataLength = await Stage.countDocuments();
        } else if (route == "area") {
            infos = await Area.find()
                .skip(skip)
                .limit(perPage);
            dataLength = await Area.countDocuments();
        } else if (route == "new-vc") {
            infos = await Fund.find({ isActive: false })
                .sort({ title: 1 })
                .populate([
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
                ])
                .skip(skip)
                .limit(perPage);
            dataLength = await Fund.countDocuments({ isActive: false });
        } else {
            infos = await Fund.find({ isActive: true })
                .sort({ title: 1 })
                .populate([
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
                ])
                .skip(skip)
                .limit(perPage);
            dataLength = await Fund.countDocuments({ isActive: true });
        }

        return NextResponse.json({ infos , dataLength });
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
