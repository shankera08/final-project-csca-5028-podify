import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(request: Request) {
    const data = await request.json();

    for (let i = 0; i < 5; i++) {
        console.log(`data i=${i}`, data);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return Response.json({ success: true });
}

export const POST = verifySignatureAppRouter(handler);
