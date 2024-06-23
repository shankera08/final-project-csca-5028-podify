import { IApiResponse } from '@/app/types/api';
import { ICategory } from '@/app/types/podcast';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

const categoryAPIUrl = () =>
    `https://api.spreaker.com/v2/show-categories`;

export async function POST() {
    try {
        const res = await fetch(categoryAPIUrl());
        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
        }
        const data: IApiResponse = await res.json();
        const categoryList: ICategory[] = data?.response?.categories?.map((category) => ({
            category_id: category.category_id,
            name: category.name,
            level: category.level,
        }))?.filter(category => category.level === 1) || [];
        if (categoryList.length === 0) {
            return NextResponse.json({ error: 'No categories found' }, { status: 500 });
        }
        const values = [];
        const valuesQuery = [];
        let i = 1;
        for (const category of categoryList) {
            values.push(...[category.category_id, category.name]);
            valuesQuery.push(`($${i++}, $${i++})`);
        }
        const valuesStr = `${valuesQuery.join(', ')}`;
        const query = `INSERT INTO category (category_id, name) VALUES ${valuesStr} ON CONFLICT (category_id) DO NOTHING;`;
        await sql.query(query, values);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Categories added successfully' }, { status: 200 });
}