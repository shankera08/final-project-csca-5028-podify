import CuratedShows from "./components/CuratedShows/CuratedShows";
import styles from "./page.module.css";
import { ICategory, IPodcast } from "./types/podcast";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const dynamic = "force-dynamic";

export default async function Home() {
  const { categories }: { categories: ICategory[] } = await (
    await fetch(`${appUrl}/api/queries/category-list`)
  )?.json();
  const curatedShows: { [key: string]: IPodcast[] }[] = [];
  if (categories?.length > 0) {
    const showsPromises = categories?.map((category: ICategory) =>
      fetch(
        `${appUrl}/api/queries/shows/${category.category_id}?title=${category.name}`
      )
    );
    const showsResponse = await Promise.all(showsPromises);
    for (const res of showsResponse) {
      if (res) {
        const show = await res.json();
        curatedShows.push(show);
      }
    }
  }
  return (
    <main className={styles.main}>
      <CuratedShows curatedShows={curatedShows} />
    </main>
  );
}
