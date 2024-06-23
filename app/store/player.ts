import { createContext, Dispatch } from "react";
import { IPlayer, IPlayerAction } from "../types/player";

export const playerInitialState: IPlayer = {
  currentShow: null,
  currentEpisode: null,
  episodes: null,
  media: false, // tracks the state of the media player. false => pause and true => play
  displayEpisodesModal: false
};

export const playerStore = createContext<{
  state: IPlayer;
  dispatch: Dispatch<IPlayerAction>;
}>({ state: playerInitialState, dispatch: () => {} });
