import { IApiResponse } from "@/app/types/api";
import { IDataCollector } from "@/app/types/dataCollector";
import { IEpisodeApi } from "@/app/types/episode";
import { ICategory } from "@/app/types/podcast";
import { IShowApi } from "@/app/types/show";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const LIMIT = 5;

const showAPIUrl = (categoryId: number, limit: number) =>
    `https://api.spreaker.com/v2/explore/categories/${categoryId}/items?limit=${limit}`;

const episodesAPIUrl = (showId: number, limit: number) =>
    `https://api.spreaker.com/v2/shows/${showId}/episodes?limit=${limit}&sorting=oldest`;

async function upsertShows(shows: IShowApi[]) {
    const values = [];
    const valuesQuery = [];
    let i = 1;
    for (const show of shows) {
        values.push(...[show.show_id, show.category_id, show.title, show.author_id, show.explicit, show.image_url]);
        valuesQuery.push(`($${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++})`);
    }
    const valuesStr = `${valuesQuery.join(', ')}`;
    const query = `
        INSERT INTO shows (
            show_id, 
            category_id,
            title,
            author_id, 
            explicit,
            image_url
        ) VALUES ${valuesStr} 
        ON CONFLICT (show_id, category_id) DO NOTHING;`;
    await sql.query(query, values);
}

async function upsertEpisodes(episodes: IEpisodeApi[]) {
    const values = [];
    const valuesQuery = [];
    let i = 1;
    for (const episode of episodes) {
        values.push(...[episode.episode_id, episode.show_id, episode.title, episode.author_id, episode.explicit, episode.image_url, episode.playback_url]);
        valuesQuery.push(`($${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++})`);
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
            playback_url
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

async function processNextShows(categoryDCs: IDataCollector[]) {
    const dcs: IDataCollector[] = [];
    const upsertedShows: IShowApi[] = [];
    for (const categoryDC of categoryDCs) {
        const showRes = await fetch(categoryDC.next_url);
        if (showRes.ok) {
            const showRaw: IApiResponse = await showRes.json();
            const showApiRes: IApiResponse['response'] = showRaw?.response;
            console.log(`${categoryDC.category_id}, showApiRes`, showApiRes);
            const shows: IShowApi[] = showApiRes?.items?.map((show: IShowApi) => ({ ...show, category_id: categoryDC.category_id }));
            if (shows && shows.length > 0) {
                await upsertShows(shows);
                upsertedShows.push(...shows);
            }
            if (showApiRes?.next_url) {
                dcs.push({ ...categoryDC, next_url: showApiRes.next_url });
            }
        }
    }
    if (dcs.length > 0) {
        await upsertDataCollector(dcs);
    }
    if (upsertedShows.length > 0) {
        await processNewEpisodes(upsertedShows);
    }
}

async function processNewEpisodes(shows: IShowApi[]) {
    console.log('start process New Episodes');
    const dcs: IDataCollector[] = [];
    for (const show of shows) {
        const epRes = await fetch(episodesAPIUrl(show.show_id, LIMIT));
        if (epRes.ok) {
            const epRaw: IApiResponse = await epRes.json();
            const epApiRes: IApiResponse['response'] = epRaw?.response;
            console.log('epApiRes', epApiRes);
            const episodes: IEpisodeApi[] = epApiRes?.items?.map((episode: IEpisodeApi) => episode);
            if (episodes && episodes.length > 0) {
                await upsertEpisodes(episodes);
            }
            if (epApiRes?.next_url) {
                dcs.push({ show_id: show.show_id, category_id: null, next_url: epApiRes.next_url });
            }
        }
    }
    if (dcs.length > 0) {
        await upsertDataCollector(dcs);
    }
}

async function processNewShows(categories: ICategory[]) {
    const dcs: IDataCollector[] = [];
    const upsertedShows: IShowApi[] = [];
    for (const category of categories) {
        const showRes = await fetch(showAPIUrl(category.category_id, LIMIT));
        if (showRes.ok) {
            const showRaw: IApiResponse = await showRes.json();
            const showApiRes: IApiResponse['response'] = showRaw?.response;
            console.log(`${category.category_id}, ${category.name}, showApiRes`, showApiRes);
            const shows: IShowApi[] = showApiRes?.items?.map((show: IShowApi) => ({ ...show, category_id: category.category_id }));
            if (shows && shows.length > 0) {
                await upsertShows(shows);
                upsertedShows.push(...shows);
            }
            if (showApiRes?.next_url) {
                dcs.push({ category_id: category.category_id, show_id: null, next_url: showApiRes.next_url });
            }
        }
    }
    console.log('dcs after upserting new shows', dcs);
    if (dcs.length > 0) {
        await upsertDataCollector(dcs);
    }
    if (upsertedShows.length > 0) {
        await processNewEpisodes(upsertedShows);
    }
}

export async function POST() {
    try {
        const dcs: IDataCollector[] = (await sql.query(`SELECT * FROM data_collector;`))?.rows;
        console.log('dcs current', dcs);
        if (dcs && dcs.length > 0) {
            const showDCs = dcs.filter(dc => !dc.category_id && dc.next_url);
            await processNextEpisodes(showDCs);

            const categoryDCs = dcs.filter(dc => !dc.show_id && dc.next_url);
            await processNextShows(categoryDCs);
        } else {
            const categories = (await sql.query(`SELECT * FROM category LIMIT 5;`))?.rows;
            console.log('categories', categories);
            if (categories) {
                await processNewShows(categories);
            }
        }
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Podcasts added successfully' }, { status: 200 });
}