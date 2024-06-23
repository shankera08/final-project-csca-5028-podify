import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const result =
            await sql`
                CREATE TABLE IF NOT EXISTS user_details ( 
                    email_address TEXT PRIMARY KEY, 
                    category_id_preference TEXT,
                    first_name VARCHAR(255),
                    last_name VARCHAR(255),
                    is_adult BOOLEAN DEFAULT FALSE,
                    country VARCHAR(255)
                );
            `;
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
