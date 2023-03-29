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

    <div class="foundvideos" v-if="foundVideos">
      <div
        class="playlist-row"
        v-for="(video, index) in foundVideos"
        :key="index"
      >
        <span class="playlist-element">{{ video.title }}</span>
        <span class="playlist-button">
          <input type="button" @click="addToPlaylist(video)" value=">" />
          <input
            v-if="isLoggedIn"
            type="button"
            @click="addToLibrary(video)"
            value="+"
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
  position: relative;
  width: 600px;

  .foundvideos {
    display: block;
    margin-left: auto;
    margin-right: auto;
    //margin-left: 25%;

    .playlist-row {
      list-style: none;
      background-color: rgb(17, 26, 29);
      display: flex;
      float: right;
      align-items: center;
      width: 600px;

      .playlist-element {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .playlist-button {
        white-space: nowrap;
        display: inline-block;
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
