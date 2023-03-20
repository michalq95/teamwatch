import { createStore } from "vuex";

export default createStore({
  state: {
    name: String,
    user: { name: null, token: null },
    library: [],
    playlist: [],
    currentIndex: 0,
    currentVideo: {
      name: "Muppets",
      link: "https://www.youtube.com/embed/tgbNymZ7vqY",
    },
    currentTime: 0,
    activeCatalog: 0,
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
    getCurrentIndex(state) {
      return state.currentIndex;
    },
    isLoggedIn(state) {
      return !!state.user.token;
    },
    getUser(state) {
      return state.user;
    },
    getLibrary(state) {
      return state.library;
    },
    getActiveCatalog(state) {
      return state.activeCatalog;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user.name = user.name;
      state.user.token = user.token;
    },
    incrementCurrentIndex(state) {
      state.currentIndex++;
    },
    setPlaylistData(state, playlistData) {
      state.playlist = playlistData.playlist;
      state.currentIndex = playlistData.currentIndex;
    },
    setStatePlaylist(state, playlist) {
      state.playlist = playlist;
    },
    setIndex(state, index) {
      state.currentIndex = index;
    },
    setCurrentVideo(state, index) {
      state.currentVideo = index;
    },
    logOut(state) {
      state.user = { name: null, token: null };
      state.library = [];
      localStorage.clear();
    },
    setLibrary(state, library) {
      state.library = library;
    },
    setActiveCatalog(state, catalog) {
      state.activeCatalog = catalog;
    },
  },
  actions: {},
  modules: {},
});
