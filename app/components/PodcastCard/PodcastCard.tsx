"use client";

import styles from "./PodcastCard.module.css";
import { IPodcast } from "@/app/types/podcast";
import podcastDefaultImg from "@/public/podcast-default.jpg";
import React, { useContext } from "react";
import { PlayerActionType } from "@/app/types/player";
import { playerStore } from "@/app/store/player";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const PodcastCard = ({
  podcast,
  isEpisode = false,
}: {
  podcast: IPodcast;
  isEpisode: boolean;
}) => {
  // get the dispatch method for the global state from the context api
  const { dispatch } = useContext(playerStore);

  // set the display image for each card.
  // replace with default image when missing in API.
  const displayImg = podcast.imageUrl || podcastDefaultImg.toString();

  const onClickCard = async () => {
    if (isEpisode) {
      dispatch({
        type: PlayerActionType.play,
        payload: { currentEpisode: podcast },
      });
    } else {
      const { episodes } = await (
        await fetch(`${appUrl}/api/queries/episodes/${podcast.id}`)
      )?.json();
      if (episodes?.length > 0) {
        dispatch({
          type: PlayerActionType.update,
          payload: {
            currentShow: podcast,
            episodes,
            displayEpisodesModal: true,
          },
        });
      }
    }
  };

  return podcast.title ? (
    <div className={styles.card} onClick={onClickCard}>
      <img className={styles.image} src={displayImg} alt="podcast logo" />
      <div className={styles.title}>{podcast.title}</div>
    </div>
  ) : null;
};

export default PodcastCard;
