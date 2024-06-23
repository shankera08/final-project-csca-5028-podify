import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const result =
            await sql`
                CREATE TABLE IF NOT EXISTS episodes ( 
                    id SERIAL PRIMARY KEY, 
                    episode_id INT NOT NULL UNIQUE,
                    show_id INT NOT NULL, 
                    title TEXT,
                    author_id INT, 
                    explicit BOOLEAN DEFAULT FALSE,
                    image_url TEXT,
                    playback_url TEXT
                );
            `;
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
