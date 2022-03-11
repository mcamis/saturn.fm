import { formatTime } from "../utilities/helpers";

import Track2 from "../songs/Cookies/02.mp3";
import Track3 from "../songs/Cookies/03.mp3";
import Track4 from "../songs/Cookies/04.mp3";

import CookiesCover from "../songs/Cookies/cover.png";

export const defaultState = {
  currentTrack: null,
  loading: false,
  repeat: "off",
  currentTime: formatTime(0),
  playing: false,
  paused: false,
  playlist: ["Track2", "Track3", "Track4"],
  tracks: {
    Track2: {
      file: Track2,
      track: 1,
      album: "Music for Touching",
      artist: "Cookies",
      title: "Go Back",
      href: "",
      albumArtUrl: CookiesCover,
    },
    Track3: {
      file: Track3,
      track: 2,
      album: "Music for Touching",
      artist: "Cookies",
      title: "July Seventeen",
      href: "",
      albumArtUrl: CookiesCover,
    },
    Track4: {
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
