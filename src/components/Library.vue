<template>
  <div class="library-wrapper">
    Library
    <input type="button" @click="loadLibrary()" value="Load" />
    <input type="button" @click="saveLibrary()" value="Save" />
    <input
      type="button"
      @click="showNewDir = !showNewDir"
      value="Add Directory"
    />
    <span v-if="showNewDir">
      <input type="text" v-model="newDirName" placeholder="name" />
      <input type="button" @click="newDir" value="+" />
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
        @click="editCatalogName(index)"
        >{{ editingIndex === index ? "" : catalog.name }}
        <input
          id="editingNameLibrary"
          v-if="editingIndex === index"
          class="edit-name"
          v-model="editedName"
          @keyup.enter="saveEditedCatalogName(index)"
          @blur="cancelEditingCatalogName"
      /></span>
      <input
        type="button"
        @click="openCloseCatalog(index)"
        :value="openedCatalogs.includes(index) ? 'Close' : 'Open'"
      />
      <div
        class="playlist-row"
        v-if="openedCatalogs.includes(index)"
        v-for="(video, index2) in catalog.playlist"
        :key="index2"
      >
        <span @click="editVideoName(index, index2)" class="playlist-element"
          >{{
            editingVideoIndex == index && editingVideoIndex2 == index2
              ? ""
              : video.name
          }}
          <input
            id="editingNameVideo"
            v-if="editingVideoIndex == index && editingVideoIndex2 == index2"
            class="edit-name"
            v-model="editedName"
            @keyup.enter="saveEditedVideoName(index, index2)"
            @blur="cancelEditingVideoName"
        /></span>
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
      editingIndex: null,
      editingVideoIndex: null,
      editingVideoIndex2: null,
      editedName: "",
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
        this.library = data.data;
      } catch (e) {
        console.error(e);
      }
    },
    editCatalogName(index) {
      this.editingIndex = index;
      this.editedName = this.library[index].name;
      this.$nextTick(() => {
        this.$el.querySelector("#editingNameLibrary").focus();
      });
    },
    saveEditedCatalogName(index) {
      this.library[index].name = this.editedName;
      this.cancelEditingCatalogName();
    },
    cancelEditingCatalogName() {
      this.editingIndex = null;
      this.editedName = "";
    },
    editVideoName(index, index2) {
      this.editingVideoIndex = index;
      this.editingVideoIndex2 = index2;
      this.editedName = this.library[index].playlist[index2].name;

      this.$nextTick(() => {
        this.$el.querySelector("#editingNameVideo").focus();
      });
    },
    saveEditedVideoName(index, index2) {
      this.library[index].playlist[index2].name = this.editedName;
      this.cancelEditingVideoName();
    },
    cancelEditingVideoName() {
      this.editingVideoIndex = null;
      this.editingVideoIndex2 = null;
      this.editedName = "";
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

    .edit-name {
      width: 300px;
      text-align: left;
    }

    .playlist-name {
      background-color: rgb(40, 54, 66);
      border-radius: 5px;
    }
    .playlist-row {
      display: flex;
      align-items: center;
      font-size: small;
      padding-left: 5px;

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
