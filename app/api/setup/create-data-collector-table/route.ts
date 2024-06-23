import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const result =
            await sql`
                CREATE TABLE IF NOT EXISTS data_collector ( 
                    id SERIAL PRIMARY KEY, 
                    category_id INT,
                    show_id INT, 
                    next_url TEXT,
                    UNIQUE(category_id, show_id)
                );
            `;
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
