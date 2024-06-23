"use client";

import React, { useContext, useEffect, useRef } from "react";
import { PlayerActionType } from "../../types/player";
import { playerStore } from "../../store/player";
import styles from "./MediaPlayer.module.css";
import { FaPlay, FaPause } from "react-icons/fa";

const MediaPlayer = () => {
  const playerState = useContext(playerStore);
  const mediaRef = useRef<HTMLMediaElement>(null);

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

  const play = () => {
    playerState.dispatch({ type: PlayerActionType.play });
  };

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
