<template>
  <div class="playlistcomponent">
    <div class="addvideo">
      <input type="text" v-model="videoRef" placeholder="link to video" />
      <input type="text" v-model="videoName" placeholder="video name" />
      <input type="button" @click="addTrack" value="+" />
      <input
        type="button"
        value="addEntireToLibrary"
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
            @click="editVideoName(index)"
            >{{ editingIndex === index ? "" : element.name }}
            <input
              id="editingPlaylist"
              v-if="editingIndex === index"
              class="edit-name"
              v-model="editedName"
              @keyup.enter="saveEditedVideoName(index)"
              @blur="cancelEditingVideoName"
          /></span>
          <span class="playlist-button">
            <input type="button" @click="setCurrent(index)" value=">" />
            <input
              v-if="isLoggedIn"
              type="button"
              @click="addToCatalog(element)"
              value="+"
            />
            <input type="button" @click="removeVideo(index)" value="-" />
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
        to: this.roomid,
      });
    },
    addTrack() {
      socket.emit("track:add", {
        video: this.videoRef,
        videoName: this.videoName,
        to: this.roomid,
      });
    },
    playlistReorder(item) {
      if (item.moved.oldIndex == this.currentIndex) {
        this.$store.commit("setIndex", item.moved.newIndex);
      } else if (item.moved.newIndex == this.currentIndex) {
        this.$store.commit("setIndex", item.moved.oldIndex);
      }
      socket.emit("track:switch", {
        playlistData: this.$store.getters.playlistData,
        to: this.roomid,
      });
    },
    removeVideo(index) {
      socket.emit("track:remove", {
        index,
        to: this.roomid,
      });
      // this.$store.commit(
      //   "setStatePlaylist",
      //   this.$store.getters.getPlaylist
      //     .slice(0, index)
      //     .concat(this.$store.getters.getPlaylist.slice(index + 1))
      // );
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
      this.playlist[index].name = this.editedName;
      socket.emit("room", {
        playlistData: this.$store.getters.playlistData,
        to: this.roomid,
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
  // position: absolute;
  // right: 0;
  // top: 0;
  max-width: 500px;
  max-height: 50vh;
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
  position: relative;
  text-align: left;
  max-height: calc(50vh - 30px);
  max-width: 490px;
  padding: 2% 2% 10% 2%;
  overflow-y: scroll;
  overflow-x: hidden;

  .listelement {
    list-style: none;
    background-color: rgb(17, 26, 29);
    //margin-left: -15px;
    // margin: 3px 0px 3px 0px;
    // padding-right: 10px;
    // max-width: 550px;
    // clear: right;
    display: flex;
    align-items: center;
    // span {
    //   white-space: nowrap;
    //   overflow: hidden;
    // }
    // input {
    //   float: right;
    //   white-space: nowrap;
    // }
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
</style>
