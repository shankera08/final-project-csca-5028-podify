import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

async function handler(request: Request) {
    const data = await request.json();
    console.log('data from notify', data);

    await fetch(`${appUrl}/api/mutations/add-episodes`, {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return Response.json({ success: true });
}

export const POST = verifySignatureAppRouter(handler);
