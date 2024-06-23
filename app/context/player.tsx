"use client";

import React, { useReducer, Reducer } from "react";

import { IPlayer, IPlayerAction } from "../types/player";
import { playerInitialState, playerStore } from "../store/player";
import { playerReducer } from "../reducer/player";

const { Provider } = playerStore;

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer<Reducer<IPlayer, IPlayerAction>>(
    playerReducer,
    playerInitialState
  );

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};
