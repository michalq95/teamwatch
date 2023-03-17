<template>
  <div>
    <div>
      <input type="text" v-model="videoRef" placeholder="link to video" />
      <input type="text" v-model="videoName" placeholder="video name" />
      <input type="button" @click="addTrack" value="Add Video" />
    </div>

    <!-- <ul v-for="(clip, index) in playlist" v-bind:key="clip.name + '_' + index">
      {{
        clip.name
      }}
      <input type="button" @click="setCurrent(index)" value="play" />
    </ul> -->

    <draggable
      v-model="playlist"
      @start="drag = true"
      @end="drag = false"
      @update="playlistReorder"
      item-key="name"
    >
      <template #item="{ element, index }">
        <div>
          {{ element.name }}
          <input type="button" @click="setCurrent(index)" value="play" />
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
    playlistReorder() {
      socket.emit("track:switch", {
        playlistData: this.$store.getters.playlistData,
        to: this.roomid,
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
