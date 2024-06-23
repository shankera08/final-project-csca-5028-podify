export interface IShowApi {
  id?: number;
  show_id: number;
  category_id?: number | null;
  title: string;
  image_url: string;
  explicit: boolean;
  author_id: number;
}
