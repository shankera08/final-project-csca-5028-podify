import { IApiResponse } from "@/app/types/api";
import { IPodcast } from "@/app/types/podcast";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const categoryId = params.id;
        const listTitle = searchParams.get("title") || "title";

        const result = await sql.query(`
            SELECT show_id, title, image_url 
            FROM shows WHERE category_id = $1
            ORDER BY id DESC
        `, [categoryId]);

        const shows: IPodcast[] = result?.rowCount > 0 ? result?.rows?.map((show) => ({
            id: show.show_id,
            title: show.title,
            imageUrl: show.image_url
        })) : [];

        return NextResponse.json({
            [listTitle]: shows,
        });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
