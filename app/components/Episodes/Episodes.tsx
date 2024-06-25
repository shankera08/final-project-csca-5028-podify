import React from "react";
import { IPodcast } from "../../types/podcast";
import PodcastCard from "../PodcastCard/PodcastCard";

const Episodes = ({ episodes }: { episodes: IPodcast[] | null }) => {
  return episodes
    ? episodes.map((episode) => (
        <PodcastCard
          podcast={episode}
          isEpisode={true}
          key={`episode-${episode.id}`}
        />
      ))
    : null;
};

export default Episodes;
