import { createStore } from "vuex";

export default createStore({
  state: {
    name: String,
    host: true,
    playlist: [
      { name: "Muppets", link: "https://www.youtube.com/embed/tgbNymZ7vqY" },
      { name: "FLoat", link: "https://www.youtube.com/watch?v=REvMpqy9G0c" },
      { name: "Immortal", link: "https://www.youtube.com/watch?v=ofyxXczVWKk" },
    ],
    currentIndex: 0,
    currentTime: 0,
  },
  getters: {
    playlistData(state) {
      return {
        playlist: state.playlist,
        currentIndex: state.currentIndex,
      };
    },
    currentClipLink(state) {
      return state.playlist[state.currentIndex].link;
    },
    isHost(state) {
      return state.host;
    },
    getPlaylist(state) {
      return state.playlist;
    },
  },
  mutations: {
    incrementCurrentIndex(state) {
      state.currentIndex++;
    },
  },
  actions: {},
  modules: {},
});
