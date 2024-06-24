import { ICategory } from "@/app/types/podcast";
import { NextResponse } from "next/server";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export async function GET() {
    try {
        const { categories }: { categories: ICategory[] } = await (
            await fetch(`${appUrl}/api/queries/category-list`)
        )?.json();
        if (!categories || categories.length === 0) {
            return NextResponse.json({ error: 'Health check failed' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Health check successful' }, { status: 200 });
}