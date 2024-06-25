import CuratedShows from "./components/CuratedShows/CuratedShows";
import styles from "./page.module.css";
import { ICategory, IPodcast } from "./types/podcast";
import Menu from "./components/Menu/Menu";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const dynamic = "force-dynamic";

export default async function Home() {
  const categories: ICategory[] = (
    await (await fetch(`${appUrl}/api/queries/category-list`))?.json()
  )?.["categories"];
  const curatedShows: { [key: string]: IPodcast[] }[] = [];
  if (categories?.length > 0) {
    const showsPromises = categories?.map((category: ICategory) =>
      fetch(
        `${appUrl}/api/queries/shows/${category.category_id}?title=${category.name}`,
        {
          cache: "no-store",
        }
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
      <Menu data-testid="menu" />
      <CuratedShows data-testid="curated-shows" curatedShows={curatedShows} />
    </main>
  );
}
