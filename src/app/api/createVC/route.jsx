import mongoose from "mongoose";
import { NextResponse } from 'next/server'
import Fund from "../../../utils/models/fund";
import { connectMongoDB } from "../../../utils/mongodb";

export async function POST(req) {
    const { data } = await req.json();
    try {
        await connectMongoDB();

        const fundType = new mongoose.Types.ObjectId(data.fundType);
        const stageList = data.stageList.map(str => new mongoose.Types.ObjectId(str));
        const focusList = data.focusList.map(str => new mongoose.Types.ObjectId(str));
        const countryList = data.countryList.map(str => new mongoose.Types.ObjectId(str));
        const cityList = data.cityList.map(str => new mongoose.Types.ObjectId(str));

        const created_vc = new Fund({
            name: data.name,
            email: data.email,
            title: data.title,
            logo: data.logo,
            founded: data.founded,
            investments: data.investments,
            exits: data.exits,
            about: data.about,
            portfolio: data.portfolio,
            fundType: fundType,
            stageList: stageList,
            focusList: focusList,
            countryList: countryList,
            cityList: cityList,
            wetsite: data.wetsite,
            isActive: false,
        });
        await created_vc.save();

        return NextResponse.json({ data: created_vc });
    } catch (error) {
        console.log(error)
        NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" })
    }
}
