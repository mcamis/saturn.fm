import React from "react";

type CurrentTrack = {
  href?: string;
  artist: string;
  title: string;
}

const CurrentTrackDisplay = (currentTrack?: CurrentTrack) => {
  if (!currentTrack) return null;

  const { href, artist, title } = currentTrack;

  return (
    <div className="current-track-info nice" key={title + artist}>
      <p>
        {title} {artist && <>- {artist}</>}
      </p>
      {href && (
        <p>
          <a href={href} target="blank">
            {href}
          </a>
        </p>
      )}
    </div>
  );
};

export default CurrentTrackDisplay;
