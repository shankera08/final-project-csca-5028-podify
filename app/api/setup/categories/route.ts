import { NextResponse } from "next/server";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export async function POST() {
    try {
        const res = await fetch(`${appUrl}/api/setup/categories/create-category-table`, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-type": "application/json",
            }
        });
        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
        }

        const res2 = await fetch(`${appUrl}/api/setup/categories/add-categories`, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-type": "application/json",
            }
        });
        if (!res2.ok) {
            return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}