"use client";

import styles from "./Podcasts.module.css";
import { IPodcast } from "@/app/types/podcast";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import React, { useState } from "react";
import PodcastCard from "../PodcastCard/PodcastCard";

const Podcasts = ({ podcasts }: { podcasts: IPodcast[] }) => {
  // local state to manage the carousal of podcasts
  const [listObj, setList] = useState<{
    list: IPodcast[] | null;
    lIndex: number;
    rIndex: number;
  }>({
    list: podcasts ? podcasts.slice(0, 5) : null,
    lIndex: 0,
    rIndex: 5,
  });

  const updateList = (offset: number) => {
    // update the displayed list of podcasts
    if (podcasts) {
      if (
        listObj.rIndex + offset <= podcasts.length &&
        listObj.lIndex + offset >= 0
      ) {
        const left = listObj.lIndex + offset;
        const right = listObj.rIndex + offset;

        if (left < right) {
          setList({
            list: podcasts.slice(left, right),
            lIndex: left,
            rIndex: right,
          });
        }
      }
    }
  };

  const arrowClickLeft = () => {
    updateList(-1);
  };

  const arrowClickRight = () => {
    updateList(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.icons} onClick={arrowClickLeft}>
        <FaAngleLeft fontSize={"100px"} />
      </div>
      {listObj.list
        ? listObj.list.map((podcast) => (
            <PodcastCard
              podcast={podcast}
              isEpisode={false}
              key={`podcasts-${podcast.id}`}
            />
          ))
        : null}
      <div className={styles.icons} onClick={arrowClickRight}>
        <FaAngleRight fontSize={"100px"} />
      </div>
    </div>
  );
};

export default Podcasts;
