export interface IPodcastApi {
  list_id: number;
  name: string;
  subtitle: string;
  type: string;
  permalink: string;
}

export interface IPodcast {
  id: number;
  authorId?: number;
  title: string;
  imageUrl?: string;
}

export interface ICategory {
  category_id: number;
  name: string;
  level: number;
}

export interface ICategoryPodcasts {
  [category: string]: IPodcast[] | undefined;
}

export interface ICategoryShowDuration {
  category_id: number;
  name: string;
  total_duration: number;
}
