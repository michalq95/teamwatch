<template>
  <div class="playlistcomponent">
    <div class="addvideo">
      <!-- <input type="text" v-model="videoRef" placeholder="link to video" />
      <input type="text" v-model="videoName" placeholder="video name" />
      <input type="button" @click="addTrack" value="+" /> -->
      <input
        v-if="isLoggedIn"
        type="button"
        value="saveAll"
        @click="addEntireToLibrary"
      />
    </div>

    <draggable
      class="list"
      v-model="playlist"
      @start="drag = true"
      @end="drag = false"
      @change="playlistReorder"
      item-key="name"
    >
      <template #item="{ element, index }">
        <div class="listelement">
          <span
            :style="index == currentIndex ? 'font-weight:bold' : ''"
            class="playlist-element"
            @click="setCurrent(index)"
            @touchstart="setCurrent(index)"
            >{{ editingIndex === index ? "" : `${element.name}` }}
            <input
              id="editingPlaylist"
              v-if="editingIndex === index"
              class="edit-name"
              v-model="editedName"
              @keyup.enter="saveEditedVideoName(index)"
              @blur="cancelEditingVideoName"
          /></span>
          <span class="playlist-buttons">
            <input
              class="playlist-button"
              type="button"
              @click="editVideoName(index)"
              @touchstart="editVideoName(index)"
              value=".."
            />
            <input
              class="playlist-button"
              v-if="isLoggedIn"
              type="button"
              @click="addToCatalog(element)"
              @touchstart="addToCatalog(element)"
              value="+"
            />
            <input
              class="playlist-button"
              type="button"
              @click="removeVideo(index)"
              @touchstart="removeVideo(index)"
              value="-"
            />
          </span>
        </div>
      </template>
    </draggable>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import socket from "../socket";

export default {
  name: "Playlist",
  components: { draggable },
  data() {
    return {
      videoName: "",
      videoRef: "",
      editingIndex: null,
      editedName: "",
    };
  },
  computed: {
    playlist: {
      get() {
        return this.$store.getters.getPlaylist;
      },
      set(value) {
        this.$store.commit("setStatePlaylist", value);
      },
    },
    library: {
      get() {
        return this.$store.getters.getLibrary;
      },
      set(value) {
        this.$store.commit("setLibrary", value);
      },
    },
    currentVideo() {
      return this.$store.getters.getCurrentVideo;
    },
    roomid() {
      return this.$route.params.roomid;
    },
    currentIndex() {
      return this.$store.getters.getCurrentIndex;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {
    setCurrent(index) {
      this.$store.commit("setIndex", index);
      socket.emit("track:switch", {
        playlistData: this.$store.getters.playlistData,
      });
    },
    addTrack() {
      socket.emit("track:add", {
        link: this.videoRef,
        name: this.videoName ? this.videoName : "nameless video",
      });
    },
    playlistReorder() {
      this.$store.commit(
        "setIndex",
        this.playlist.findIndex((el) => el.idIndex == this.currentVideo.idIndex)
      );
      socket.emit("track:switch", {
        playlistData: this.$store.getters.playlistData,
      });
    },
    removeVideo(index) {
      socket.emit("track:remove", {
        index,
      });
    },
    addToCatalog(video) {
      let lib = this.library;
      lib[this.$store.getters.getActiveCatalog].playlist.push(video);
      this.library = lib;
    },
    editVideoName(index) {
      this.editingIndex = index;
      this.editedName = this.playlist[index].name;
      this.$nextTick(() => {
        this.$el.querySelector("#editingPlaylist").focus();
      });
    },
    saveEditedVideoName(index) {
      this.playlist[index].name = this.editedName ? this.editedName : "";
      socket.emit("room", {
        playlistData: this.$store.getters.playlistData,
      });
      this.cancelEditingVideoName();
    },
    cancelEditingVideoName() {
      this.editingIndex = null;
      this.editedName = "";
    },
    addEntireToLibrary() {
      var today = new Date();
      this.library.push({
        name: `${today.getFullYear()}-${
          today.getMonth() + 1
        }-${today.getDate()}`,
        playlist: this.playlist,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.playlistcomponent {
  border-radius: 7px;
  margin: 15px;
  padding-bottom: 20px;
  background-color: rgb(26, 33, 41);
  overflow: hidden;

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  .addvideo {
    position: relative;
    margin: 10px 10px 0px 0px;

    border-radius: 5px;
    border-color: black;
    border-width: 1px;
  }
}
.list {
  border: 2 solid white;
  padding: 2px;
  position: relative;
  text-align: left;
  max-height: 410px;
  padding: 2px 4px 15px 4px;
  overflow-y: scroll;
  overflow-x: hidden;

  .listelement {
    border: 2px dotted rgb(168, 167, 230);
    border-radius: 8px;
    margin-bottom: -2px;
    padding-left: 5px;
    list-style: none;
    background-color: rgb(17, 26, 29);
    display: flex;
    align-items: center;

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
        padding: 5px;
        font-size: large;
        margin-right: 2px;
      }
    }
  }
}
</style>
