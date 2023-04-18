import { createStore } from "vuex";
import router from "../router";

export default createStore({
  state: {
    name: String,
    roomPassword: null,
    user: { name: null, token: null, id: null },
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
    getCurrentVideo(state) {
      return state.currentVideo;
    },
    getRoomPassword(state) {
      return state.roomPassword;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user.name = user.name;
      state.user.token = user.token;
      state.user.id = user.id;
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
      router.push({ name: "home" });
    },
    setLibrary(state, library) {
      state.library = library;
    },
    setActiveCatalog(state, catalog) {
      state.activeCatalog = catalog;
    },
    setRoomPassword(state, password) {
      state.roomPassword = password;
    },
  },
  actions: {},
  modules: {},
});
