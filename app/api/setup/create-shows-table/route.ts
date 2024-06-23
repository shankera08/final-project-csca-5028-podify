import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const result =
            await sql`
                CREATE TABLE IF NOT EXISTS shows ( 
                    id SERIAL PRIMARY KEY, 
                    show_id INT NOT NULL, 
                    category_id INT NOT NULL references category(category_id),
                    title TEXT,
                    author_id INT,
                    explicit BOOLEAN DEFAULT FALSE,
                    image_url TEXT,
                    UNIQUE(show_id, category_id)
                );
            `;
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
