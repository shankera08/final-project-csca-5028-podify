import React from "react";

// Internal imports

// Types
import { IPodcast } from "../../types/podcast";
import PodcastCard from "../PodcastCard/PodcastCard";

/**
 *
 * @param episodes list of episodes based on the selected podcast
 */
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
