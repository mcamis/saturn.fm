import { formatTime } from "utilities/helpers";

import Track2 from "../songs/cookies/02.mp3";
import Track3 from "../songs/cookies/03.mp3";
import Track4 from "../songs/cookies/04.mp3";

import CookiesCover from "../songs/cookies/cover.jpg";

export const defaultState = {
  currentTrack: null,
  loading: false,
  repeat: "off",
  currentTime: formatTime(0),
  playing: false,
  paused: false,
  playlist: ["01", "02", "03"],
  tracks: {
    "01": {
      file: Track2,
      track: 1,
      album: "Music for Touching",
      artist: "Cookies",
      title: "Go Back",
      href: "",
      albumArtUrl: CookiesCover,
    },
    "02": {
      file: Track3,
      track: 2,
      album: "Music for Touching",
      artist: "Cookies",
      title: "July Seventeen",
      href: "",
      albumArtUrl: CookiesCover,
    },
    "03": {
      file: Track4,
      track: 3,
      album: "Music for Touching",
      artist: "Cookies",
      title: "Crybaby (A)",
      href: "",
      albumArtUrl: CookiesCover,
    },
  },
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case "PLAYING":
      return {
        ...state,
        playing: true,
        paused: false,
      };
    case "PAUSED":
      return {
        ...state,
        playing: false,
        paused: true,
      };
    case "TOGGLE_REPEAT":
      return {
        ...state,
        repeat: action.data.repeat,
      };

    case "SET_CURRENT_TRACK":
      return {
        ...state,
        currentTrack: action.data.trackIndex,
      };

    case "ADD_TRACKS":
      return {
        ...state,
        tracks: {
          ...state.tracks,
          ...action.data.tracks,
        },
        playlist: [
          ...state.playlist,
          // sort new tracks before adding them
          ...Object.keys(action.data.tracks).sort((a, b) => {
            const A = action.data.tracks[a];
            const B = action.data.tracks[b];
            if (A.album > B.album) return 1;
            if (A.album < B.album) return -1;
            if (A.track > B.track) return 1;
            if (A.track < B.track) return -1;
          }),
        ],
      };

    case "ARRANGE_TRACKS":
      return {
        ...state,
        playlist: action.data.playlist,
      };

    case "REMOVE_TRACK": {
      const trackKey = state.playlist[action.datatrackIndex];
      const { [trackKey]: removedTrack, ...cleanTracks } = state.tracks;
      return {
        ...state,
        playlist: [
          ...state.playlist.slice(0, action.data.trackIndex),
          ...state.playlist.slice(action.data.trackIndex + 1),
        ],
        tracks: {
          ...cleanTracks,
        },
      };
    }
    default:
      return state;
  }
};
