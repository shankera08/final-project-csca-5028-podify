"use client";

import React, { useContext, useEffect, useRef } from "react";

// Types
import { PlayerActionType } from "../../types/player";

// Global Store - Context API
import { playerStore } from "../../store/player";

import styles from "./MediaPlayer.module.css";
import { FaPlay, FaPause } from "react-icons/fa";

const MediaPlayer = () => {
  // global state object
  const playerState = useContext(playerStore);
  // ref to media player
  const mediaRef = useRef<HTMLMediaElement>(null);

  // update media player based on global state
  useEffect(() => {
    if (playerState.state.media) {
      if (mediaRef.current) {
        mediaRef.current.play();
      }
    } else {
      if (mediaRef.current) {
        mediaRef.current.pause();
      }
    }
  }, [playerState.state.media, playerState.state.currentEpisode]);

  // stream episode from "Spreaker" API
  const getMediaSource = () => {
    return playerState.state.currentEpisode
      ? `https://api.spreaker.com/v2/episodes/${playerState.state.currentEpisode.id}/play`
      : "";
  };

  // onClick handler for play icon
  const play = () => {
    playerState.dispatch({ type: PlayerActionType.play });
  };

  // onClick handler for pause icon
  const pause = () => {
    playerState.dispatch({ type: PlayerActionType.pause });
  };

  return (
    <div>
      <audio ref={mediaRef} src={getMediaSource()}></audio>
      {playerState.state.currentEpisode && (
        <div className={styles.player}>
          <div className={styles.icons}>
            <div className={styles.play}>
              <FaPlay onClick={play} />
            </div>
            <div className={styles.pause}>
              <FaPause onClick={pause} />
            </div>
          </div>
          <div className={styles.title}>
            Now Playing: {playerState.state.currentEpisode?.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPlayer;
