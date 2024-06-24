import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

export const dynamic = "force-dynamic";

export const config = {
    api: { bodyParser: false },
};

async function handler(request: Request) {
    const data = await request.json();

    for (let i = 0; i < 5; i++) {
        console.log(`data i=${i}`, data);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return Response.json({ success: true });
}

export const POST = verifySignatureAppRouter(handler);