<template>
  <div class="playlistcomponent">
    <div class="addvideo">
      <input type="text" v-model="videoRef" placeholder="link to video" />
      <input type="text" v-model="videoName" placeholder="video name" />
      <input type="button" @click="addTrack" value="Add Video" />
      {{ currentIndex }}
    </div>

    <!-- <ul v-for="(clip, index) in playlist" v-bind:key="clip.name + '_' + index">
      {{
        clip.name
      }}
      <input type="button" @click="setCurrent(index)" value="play" />
    </ul> -->
    {{ playlist }}

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
          <span>{{ element.name }}</span>
          <input type="button" @click="setCurrent(index)" value="play" />
          <input type="button" @click="removeVideo(index)" value="del" />
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
    roomid() {
      return this.$route.params.roomid;
    },
    currentIndex() {
      return this.$store.getters.getCurrentIndex;
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
      socket.emit("room", {
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
  },
};
</script>
<style lang="scss" scoped>
.playlistcomponent {
  position: fixed;
  right: 0;
  top: 0;
  width: 500px;
  border-radius: 5%;

  background-color: whitesmoke;
  overflow: hidden;

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  .addvideo {
    position: relative;
    margin: 10px 0px 10px 0px;

    border-radius: 5%;
    border-color: black;
    border-width: 1px;
  }
}
.list {
  position: relative;

  text-align: left;
  max-height: 50vh;
  max-width: 490px;
  padding: 2% 0% 2% 2%;

  overflow-y: scroll;
  overflow-x: hidden;

  .listelement {
    list-style: none;
    background-color: whitesmoke;
    //margin-left: -15px;
    margin: 3px 0px 3px 0px;
    padding-right: 10px;
    max-width: 550px;
    clear: right;
    span {
      white-space: nowrap;
      overflow: hidden;
    }
    input {
      float: right;
      white-space: nowrap;
    }
  }
}
</style>
