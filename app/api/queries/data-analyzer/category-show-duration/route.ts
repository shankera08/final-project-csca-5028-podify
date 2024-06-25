import { ICategoryShowDuration } from "@/app/types/podcast";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

async function getCategoryShowDuration(): Promise<ICategoryShowDuration[]> {
    const result = await sql.query<ICategoryShowDuration>(`
        SELECT ca.category_id, ca.name, SUM(ep.duration) AS total_duration 
        FROM shows sh INNER JOIN category ca ON sh.category_id = ca.category_id
        INNER JOIN episodes ep ON ep.show_id = sh.show_id
        GROUP BY ca.category_id, ca.name
        ORDER BY ca.name
    `);
    return result?.rowCount > 0 ? result.rows : []
}

export async function GET() {
    try {
        const categoryShowDuration = await getCategoryShowDuration();
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
