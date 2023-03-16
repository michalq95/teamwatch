import { createStore } from "vuex";

export default createStore({
  state: {
    host: true,
    playlist: [
      "https://www.youtube.com/embed/tgbNymZ7vqY",
      "https://www.youtube.com/watch?v=REvMpqy9G0c",
      "https://www.youtube.com/watch?v=ofyxXczVWKk",
    ],
    currentIndex: 0,
  },
  getters: {
    currentClipLink(state) {
      return state.playlist[state.currentIndex];
    },
    isHost(state) {
      return state.host;
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
