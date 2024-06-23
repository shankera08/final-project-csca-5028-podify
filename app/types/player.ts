import { IPodcast } from "./podcast";

export enum PlayerActionType {
  play = "play",
  pause = "pause",
  update = "update",
  display = "display"
}

export interface IPlayerAction {
  type: PlayerActionType;
  payload?: {
    currentShow?: IPodcast | null;
    currentEpisode?: IPodcast | null;
    episodes?: IPodcast[] | null;
    displayEpisodesModal?: boolean;
  };
}

export interface IPlayer {
  currentShow: IPodcast | null;
  currentEpisode: IPodcast | null;
  episodes: IPodcast[] | null;
  media: boolean;
  displayEpisodesModal: boolean;
}
