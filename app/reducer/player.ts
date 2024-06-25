import { Reducer } from "react";

import { PlayerActionType, IPlayer, IPlayerAction } from "../types/player";

export const playerReducer: Reducer<IPlayer, IPlayerAction> = (
  state,
  action
) => {
  switch (action.type) {
    case PlayerActionType.play:
      if (action.payload && action.payload.currentEpisode) {
        return {
          ...state,
          currentEpisode: action.payload.currentEpisode,
          media: true
        };
      } else {
        return { ...state, media: true };
      }
    case PlayerActionType.pause:
      return { ...state, media: false };
    case PlayerActionType.update:
      if (
        action.payload &&
        action.payload.currentShow &&
        action.payload.episodes
      ) {
        return {
          ...state,
          currentShow: action.payload.currentShow,
          episodes: action.payload.episodes,
          displayEpisodesModal: true
        };
      } else {
        return state;
      }
    case PlayerActionType.display:
      if (action.payload && action.payload.displayEpisodesModal) {
        return {
          ...state,
          displayEpisodesModal: action.payload.displayEpisodesModal
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};
