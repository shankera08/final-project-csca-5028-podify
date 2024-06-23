import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await sql.query(`
            SELECT ca.category_id, ca.name, SUM(ep.duration) AS total_duration 
            FROM shows sh INNER JOIN category ca ON sh.category_id = ca.category_id
            INNER JOIN episodes ep ON ep.show_id = sh.show_id
            GROUP BY ca.category_id, ca.name
            ORDER BY ca.name
        `);
        return NextResponse.json({
            categoryShowDuration: result?.rowCount > 0 ? result.rows : [],
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
