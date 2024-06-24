import { IApiResponse } from "@/app/types/api";
import { IDataCollector } from "@/app/types/dataCollector";
import { IEpisodeApi } from "@/app/types/episode";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

async function upsertEpisodes(episodes: IEpisodeApi[]) {
    const values = [];
    const valuesQuery = [];
    let i = 1;
    for (const episode of episodes) {
        values.push(...[episode.episode_id, episode.show_id, episode.title, episode.author_id, episode.explicit, episode.image_url, episode.playback_url, episode.duration]);
        valuesQuery.push(`($${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++})`);
    }
    const valuesStr = `${valuesQuery.join(', ')}`;
    const query = `
        INSERT INTO episodes (
            episode_id,
            show_id, 
            title,
            author_id, 
            explicit,
            image_url,
            playback_url,
            duration
        ) VALUES ${valuesStr} 
        ON CONFLICT (episode_id) DO UPDATE SET playback_url = EXCLUDED.playback_url;`;
    await sql.query(query, values);
}

async function upsertDataCollector(dcs: IDataCollector[]) {
    const dcValues = [];
    const dcValuesQuery = [];
    let i = 1;
    for (const dc of dcs) {
        dcValues.push(...[dc.category_id, dc.show_id, dc.next_url]);
        dcValuesQuery.push(`($${i++}, $${i++}, $${i++})`);
    }
    const dcValuesStr = `${dcValuesQuery.join(', ')}`;
    const dcQuery = `
        INSERT INTO data_collector (
            category_id,
            show_id,
            next_url
        ) VALUES ${dcValuesStr} 
        ON CONFLICT (category_id, show_id) DO UPDATE SET next_url = EXCLUDED.next_url;`;
    console.log(dcQuery);
    console.log(dcValues);
    await sql.query(dcQuery, dcValues);
}

async function processNextEpisodes(showDCs: IDataCollector[]) {
    const dcs: IDataCollector[] = [];
    for (const showDC of showDCs) {
        const epRes = await fetch(showDC.next_url);
        if (epRes.ok) {
            const epRaw: IApiResponse = await epRes.json();
            const epApiRes: IApiResponse['response'] = epRaw?.response;
            console.log('epApiRes', epApiRes);
            const episodes: IEpisodeApi[] = epApiRes?.items?.map((episode: IEpisodeApi) => episode);
            if (episodes && episodes.length > 0) {
                await upsertEpisodes(episodes);
            }
            if (epApiRes?.next_url) {
                dcs.push({ ...showDC, next_url: epApiRes.next_url });
            }
        }
    }
    if (dcs.length > 0) {
        await upsertDataCollector(dcs);
    }
}

export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        if (!req) {
            return NextResponse.json({ error: 'Data Collectors missing' }, { status: 500 });
        }
        const dcs = <IDataCollector[]>req;
        console.log('dcs current', dcs);
        if (dcs && dcs.length > 0) {
            const showDCs = dcs.filter(dc => !dc.category_id && dc.next_url);
            await processNextEpisodes(showDCs);
        }
    } catch (error) {
        console.log('Error', error);
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Episodes added successfully', success: true }, { status: 200 });
}