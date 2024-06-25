import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { Utils } from '../utils';

export async function POST() {
    try {
        const result = await Utils.createCategoryTable();
        return NextResponse.json({ success: result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
