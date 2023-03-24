<template>
  <div>
    <input type="text" v-model="searchPhrase" placeholder="Search" />
    <input type="button" @click="search" value="Search" />

    <div v-if="foundVideos">
      <ul>
        <li v-for="(video, index) in foundVideos" :key="index">
          {{ video.title }}
          <input
            type="button"
            @click="addToPlaylist(video)"
            value="AddToPlaylist"
          />
          <input
            type="button"
            @click="addToLibrary(video)"
            value="AddToLibrary"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import socket from "../socket";
export default {
  name: "Search",
  data() {
    return {
      searchPhrase: "",
      foundVideos: [],
    };
  },
  mounted() {
    socket.on("search:youtube", ({ videos }) => {
      this.foundVideos = videos;
    });
  },
  methods: {
    search() {
      socket.emit("search:youtube", { searchPhrase: this.searchPhrase });
    },
    addToPlaylist(video) {
      socket.emit("track:add", {
        video: `https://www.youtube.com/watch?v=${video.id}`,
        videoName: video.title,
        to: this.roomid,
      });
    },
    addToLibrary(video) {
      let lib = this.library;
      lib[this.$store.getters.getActiveCatalog].playlist.push({
        name: video.title,
        link: `https://www.youtube.com/watch?v=${video.id}`,
      });
      this.library = lib;
    },
  },
  computed: {
    library: {
      get() {
        return this.$store.getters.getLibrary;
      },
      set(value) {
        this.$store.commit("setLibrary", value);
      },
    },
    activeCatalog: {
      get() {
        return this.$store.getters.getActiveCatalog;
      },
      set(value) {
        this.$store.commit("setActiveCatalog", value);
      },
    },
    playlist: {
      get() {
        return this.$store.getters.getPlaylist;
      },
      set(value) {
        this.$store.commit("setStatePlaylist", value);
      },
    },
    roomid() {
      return this.$route.params.roomid;
    },
  },
};
</script>
<style lang="scss" scoped></style>
