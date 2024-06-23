import { IApiResponse } from "@/app/types/api";
import { IPodcast } from "@/app/types/podcast";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const showId = params.id;
    const result = await sql.query(`
      SELECT episode_id, author_id, title, image_url
      FROM episodes WHERE show_id = $1
    `, [showId]);

    const episodes: IPodcast[] = result?.rowCount > 0 ? result.rows?.map((episode) => ({
      id: episode.episode_id,
      authorId: episode.author_id,
      title: episode.title,
      imageUrl: episode.image_url
    })) : [];

    return NextResponse.json({
      episodes,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
