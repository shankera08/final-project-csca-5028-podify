import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const result =
            await sql`
                CREATE TABLE IF NOT EXISTS category ( id SERIAL PRIMARY KEY, category_id INT UNIQUE, name VARCHAR(255) );
            `;
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
