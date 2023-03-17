<template>
  <div>
    <div>
      <input type="text" v-model="videoRef" />
      <input type="text" v-model="videoName" />
      <input type="button" @click="addTrack" value="Add Video" />
    </div>
    <ul v-for="(clip, index) in playlist" v-bind:key="clip.name + '_' + index">
      {{
        clip.name
      }}
      <input type="button" @click="setCurrent(index)" value="play" />
    </ul>
  </div>
</template>
<script>
import socket from "../socket";

export default {
  name: "Playlist",
  data() {
    return {
      videoName: "",
      videoRef: "",
    };
  },
  computed: {
    playlist() {
      return this.$store.getters.getPlaylist;
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
  },
};
</script>
<style lang="scss" scoped></style>
