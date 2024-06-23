"use client";

import { PlayerProvider } from "@/app/context/player";
import React, { useRef } from "react";
import MediaPlayer from "../MediaPlayer/MediaPlayer";
import Podcasts from "../Podcasts/Podcasts";
import styles from "./CuratedShows.module.css";
import { IPodcast } from "@/app/types/podcast";
import EpisodesModal from "../EpisodesModel/EpisodesModal";

const CuratedShows = ({
  curatedShows,
}: {
  curatedShows: {
    [key: string]: IPodcast[];
  }[];
}) => {
  const podcastRef = useRef<HTMLDivElement>(null);
  return (
    <PlayerProvider>
      <div className={styles.curated} ref={podcastRef}>
        {curatedShows?.map((show) => {
          const showTitle = Object.keys(show)[0];
          const podcasts = show[showTitle];
          return (
            <div key={showTitle} className={styles.category}>
              <div className={styles.title}>{showTitle}</div>
              <div className={styles.podcasts}>
                <Podcasts podcasts={podcasts} />
              </div>
            </div>
          );
        })}
      </div>
      <EpisodesModal podcastRef={podcastRef} />
      <MediaPlayer />
    </PlayerProvider>
  );
};

export default CuratedShows;
