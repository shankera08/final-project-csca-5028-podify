import { IApiResponse } from '@/app/types/api';
import { ICategory } from '@/app/types/podcast';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { Utils } from '../utils';

const categoryAPIUrl = () =>
    `https://api.spreaker.com/v2/show-categories`;

export async function POST() {
    try {
        const data = await Utils.getCategoryDataFromAPI();
        if (!data) {
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
        }
        const categoryList: ICategory[] = data?.response?.categories?.map((category) => ({
            category_id: category.category_id,
            name: category.name,
            level: category.level,
        }))?.filter(category => category.level === 1) || [];
        if (categoryList.length === 0) {
            return NextResponse.json({ error: 'No categories found' }, { status: 500 });
        }
        const result = await Utils.upsertCategories(categoryList);
        return NextResponse.json({ success: result, categories: categoryList }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}