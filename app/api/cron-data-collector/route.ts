import { NextResponse } from "next/server";

export const maxDuration = 60;

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export async function GET() {
    try {
        await fetch(`${appUrl}/api/mutations/add-podcasts`, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-type": "application/json",
            },
        });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Cron data collector - add-podcasts called successfully' }, { status: 200 });
}