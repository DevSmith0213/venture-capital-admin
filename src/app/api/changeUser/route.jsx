import mongoose from "mongoose";
import { NextResponse } from 'next/server';
import User from "../../../utils/models/user";
import Startup from "../../../utils/models/startup";
import Pitch from "../../../utils/models/pitch";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { id, type } = await req.json();
    try {
        await connectMongoDB();
        const user = await User.findById(new mongoose.Types.ObjectId(id));
        if (user) {
            if (type == "change") {
                user.isActive = !user.isActive;
                await user.save();

                const startup = await Startup.findOne({ user_id: id });
                if (startup) {
                    startup.isActive = user.isActive;
                    await startup.save();

                    await Pitch.updateMany(
                        { startup_id: startup._id.toString() },
                        { $set: { isActive: user.isActive } }
                    );
                }

            } else if (type == "remove") {
                await User.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
                const startup = await Startup.findOneAndDelete({ user_id: id });
                if (startup) {
                    await Pitch.deleteMany({ startup_id: startup._id });
                }
            }
            return NextResponse.json(user);
        }

        return NextResponse.status(403).json({ message: "There is no user" });
    } catch (error) {
        console.log(error);
        return NextResponse.status(500).json({ message: `It has been ${type} failed` });
    }
}
