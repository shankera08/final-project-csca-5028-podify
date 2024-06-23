import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await sql.query(`SELECT * FROM category`);
        return NextResponse.json({
            categories: result?.rowCount > 0 ? result.rows : [],
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
