<template>
  <div class="library-wrapper">
    Library
    <input type="button" @click="loadLibrary()" value="load" />
    <input type="button" @click="saveLibrary()" value="save" />
    <input
      type="button"
      @click="showNewDir = !showNewDir"
      value="add Directory"
    />
    <span v-if="showNewDir">
      <input type="text" v-model="newDirName" placeholder="new dir name" />
      <input type="button" @click="newDir" value="addDir" />
    </span>

    <div
      class="library"
      v-for="(catalog, index) in library"
      :key="index"
      @click="activeCatalog = index"
    >
      <span
        class="playlist-name"
        :style="index == activeCatalog ? 'font-weight:bold' : ''"
        >{{ catalog.name }}</span
      >
      <input type="button" @click="openCloseCatalog(index)" value="open" />
      <div
        class="playlist-row"
        v-if="openedCatalogs.includes(index)"
        v-for="(video, index2) in catalog.playlist"
        :key="index2"
      >
        <span class="playlist-element">{{ video.name }}</span>
        <span class="playlist-button">
          <input type="button" @click="addToPlaylist(video)" value="+" />
          <input
            type="button"
            @click="removeFromPlaylist(index, index2)"
            value="-"
          />
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import socket from "../socket";

export default {
  name: "Library",
  data() {
    return {
      openedCatalogs: [],
      showNewDir: false,
      newDirName: "",
    };
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
    roomid() {
      return this.$route.params.roomid;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
  mounted() {
    if (this.library.length == 0) {
      this.loadLibrary();
    }
  },
  methods: {
    openCloseCatalog(index) {
      if (this.openedCatalogs.includes(index)) {
        this.openedCatalogs = this.openedCatalogs.filter((el) => el !== index);
      } else {
        this.openedCatalogs.push(index);
      }
    },
    newDir() {
      this.library.push({ name: this.newDirName, playlist: [] });
      this.showNewDir = false;
      this.newDirName = "";
    },
    addToPlaylist(video) {
      socket.emit("track:add", {
        video: video.link,
        videoName: video.name,
        to: this.roomid,
      });
    },
    removeFromPlaylist(index, index2) {
      this.library[index].playlist.splice(index2, 1);
    },
    async saveLibrary() {
      let uri = `${process.env.VUE_APP_BACKEND_URL}api/user/library`;
      try {
        const res = await fetch(uri, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${this.user.token}`,
          },
          body: JSON.stringify(this.library),
        });
        const data = await res.json();
        console.log(data);
        this.library = data.data;
      } catch (e) {
        console.error(e);
      }
    },
    async loadLibrary() {
      let uri = `${process.env.VUE_APP_BACKEND_URL}api/user/library`;
      try {
        const res = await fetch(uri, {
          method: "GET",
          mode: "cors",
          headers: {
            // "Content-Type": "application/json",
            authorization: `Bearer ${this.user.token}`,
          },
        });
        const data = await res.json();
        console.log(data);
        this.library = data.data;
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.library-wrapper {
  width: 640px;
  .library {
    background-color: rgb(24, 27, 37);
    text-align: left;
    max-width: 630px;

    .playlist-name {
      background-color: rgb(40, 54, 66);
      border-radius: 5px;
    }
    .playlist-row {
      display: flex;
      align-items: center;

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
}
</style>
