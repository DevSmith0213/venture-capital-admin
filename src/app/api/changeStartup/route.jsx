import mongoose from "mongoose";
import { NextResponse } from 'next/server';
import Startup from "../../../utils/models/startup";
import User from "../../../utils/models/user";
import Pitch from "../../../utils/models/pitch";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { id } = await req.json();
    try {
        await connectMongoDB();

        const startup = await Startup.findById(new mongoose.Types.ObjectId(id));
        if (startup) {
            const user = await User.findById(new mongoose.Types.ObjectId(startup.user_id));
            if(!user.isActive && !startup.isActive){
                return NextResponse.status(403).json({ message: "Update failed, The user of this startup is inactive." });
            }

            startup.isActive = !startup.isActive;
            await startup.save();
            await Pitch.updateMany(
                { startup_id: id },
                { $set: { isActive: startup.isActive } }
            );
            return NextResponse.json(startup);
        }
        return NextResponse.status(403).json({ message: "There is no startup" });
    } catch (error) {
        console.log(error);
        return NextResponse.status(500).json({ message: `It has been update failed` });
    }
}
