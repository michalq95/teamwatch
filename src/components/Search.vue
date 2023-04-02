<template>
  <div class="search-container">
    <input
      type="text"
      v-model="searchPhrase"
      placeholder="Search"
      class="searchbar"
      @keyup.enter="search"
    />
    <input type="button" class="searchbutton" @click="search" value="Search" />
    <input
      v-if="foundVideos.length"
      type="button"
      class="searchbutton"
      @click="playAll"
      value="Play All"
    />
    <div class="foundvideos" v-if="foundVideos.length">
      <div
        class="playlist-row"
        v-for="(video, index) in foundVideos"
        :key="index"
      >
        <span class="playlist-element">{{ video.title }}</span>
        <span class="playlist-buttons">
          <input
            type="button"
            @click="addToPlaylist(video)"
            value=">"
            class="playlist-button"
          />
          <input
            v-if="isLoggedIn"
            type="button"
            @click="addToLibrary(video)"
            value="+"
            class="playlist-button"
          />
        </span>
      </div>
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
      foundVideos: [
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
        { title: "aezakmi" },
      ],
    };
  },
  mounted() {
    socket.on("search:youtube", ({ videos }) => {
      this.foundVideos = videos;
    });
  },
  methods: {
    search() {
      //ale zajebista sciane ifow zrobilem
      let match;
      // socket.emit("search:youtube", { searchPhrase: this.searchPhrase });
      // if (this.searchPhrase.length == 11) {

      //   console.log("possible id");
      // } else {
      match = this.searchPhrase.match(/list=([^&]*)/);
      console.log(match);
      if (match) {
        socket.emit("playlist:get", { phrase: match[1] });
        console.log("playlist");
      } else {
        match = this.searchPhrase.match(/v=([a-zA-Z0-9_-]+)&?/);
        console.log(match);
        if (match) {
          socket.emit("video:get", { phrase: match[1] });
          console.log("normal video");
        } else {
          socket.emit("search:youtube", { searchPhrase: this.searchPhrase });
          console.log("search phrase");
        }
      }
      // }
    },
    addToPlaylist(video) {
      socket.emit("track:add", {
        link: `https://www.youtube.com/watch?v=${video.id}`,
        name: video.title,
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
    playAll() {
      socket.emit("tracks:add", {
        videos: this.foundVideos.map((el) => ({
          name: el.title,
          link: `https://www.youtube.com/watch?v=${el.id}`,
        })),
      });
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
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>
<style lang="scss" scoped>
.search-container {
  //display: flex;
  // align-items: center;
  margin-top: 12px;
  position: relative;
  // width: 600px;

  .foundvideos {
    display: block;
    margin-left: auto;
    margin-right: auto;
    overflow-y: scroll;

    //margin-left: 25%;

    .playlist-row {
      list-style: none;
      background-color: rgb(17, 26, 29);
      display: flex;
      float: right;
      align-items: center;
      width: 650px;

      .playlist-element {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .playlist-buttons {
        white-space: nowrap;
        display: inline-block;
        .playlist-button {
          padding: 3px 6px;
        }
      }
    }
  }

  .searchbar {
    position: relative;
    height: 30px;
    width: 300px;
    border-radius: 8px;
    color: rgb(172, 172, 189);
    margin-bottom: 5px;
    margin-right: 5px;
  }
  .searchbutton {
    height: 30px;
    border-radius: 8px;
    color: rgb(172, 172, 189);
    margin-bottom: 5px;
    margin-right: 5px;
  }
}
</style>
