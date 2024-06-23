export interface IEpisodeApi {
  id?: number;
  episode_id: number;
  title: string;
  show_id: number;
  author_id: number;
  image_url: string;
  playback_url: string;
  explicit: boolean;
  duration: number;
}
