import { ICategoryShowDuration } from "@/app/types/podcast";
import { NextResponse } from "next/server";
import { Util } from "./util";

export async function GET() {
    try {
        const categoryShowDuration = await Util.getCategoryShowDuration();
        return NextResponse.json({
            categoryShowDuration: categoryShowDuration?.map((ca: ICategoryShowDuration) => ({
                ...ca,
                total_duration: Math.round(Number(ca.total_duration) / (1000 * 60 * 60)),
            })),
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
