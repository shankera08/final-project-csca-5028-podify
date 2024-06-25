import React, { useContext, useEffect, useRef } from "react";
import Episodes from "../Episodes/Episodes";
import { playerStore } from "../../store/player";
import { PlayerActionType } from "../../types/player";
import styles from "./EpisodesModel.module.css";
import { FaTimes } from "react-icons/fa";

const EpisodesModal = ({
  podcastRef,
}: {
  podcastRef: React.RefObject<HTMLDivElement>;
}) => {
  const playerState = useContext(playerStore);
  // ref to the modal container
  const episodeModalRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    if (episodeModalRef.current) {
      episodeModalRef.current.style.display = "none";
    }

    // dispatch the action to set the display for modal to false
    // to ensure that it stay invisible in future rerenders
    playerState.dispatch({
      type: PlayerActionType.display,
      payload: {
        displayEpisodesModal: false,
      },
    });
  };

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const currentTarget = event.target as HTMLDivElement;

      // exclude the modal and the media player from triggering the close action
      if (
        podcastRef.current &&
        !podcastRef.current.contains(currentTarget) &&
        !currentTarget?.className?.toString().includes("episodesContainer") &&
        !currentTarget?.className?.toString().includes("player")
      ) {
        if (episodeModalRef.current) {
          episodeModalRef.current.style.display = "none";
        }
        playerState.dispatch({
          type: PlayerActionType.display,
          payload: {
            displayEpisodesModal: false,
          },
        });
      }
    };

    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("click", onClickOutside);
    };
  }, [podcastRef, playerState]);

  // reset the modal to display flex if the display flag or the new podcast is selected
  useEffect(() => {
    if (episodeModalRef.current && playerState.state.displayEpisodesModal) {
      episodeModalRef.current.style.display = "flex";
    }
  }, [playerState.state.displayEpisodesModal, playerState.state.episodes]);

  return playerState.state.displayEpisodesModal ? (
    <div className={styles.background} ref={episodeModalRef}>
      <div className={styles.episodesContainer}>
        <div className={styles.header}>
          <div className={styles.title}>
            <div className={styles.heading}>
              {playerState.state.currentShow &&
                playerState.state.currentShow.title}
            </div>
            <div className={styles.subheading}>Episodes</div>
          </div>
          <div className={styles.close} onClick={onClose}>
            <FaTimes />
          </div>
        </div>
        {playerState.state.episodes ? (
          <div className={styles.list}>
            <Episodes episodes={playerState.state.episodes} />
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
};

export default EpisodesModal;
