<template>
  <div>
    <ul v-for="(clip, index) in playlist" v-bind:key="index">
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
      socket.emit("track:choose", {
        to: this.roomid,
        index,
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
