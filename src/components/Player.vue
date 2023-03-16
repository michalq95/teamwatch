<template>
  <YouTube
    v-bind:src="currentClipLink"
    @ready="onReady"
    @stateChange="onStateChange"
    ref="youtube"
  />
  Shared: <input type="checkbox" v-model="shared" /> Volume:
  <input type="range" min="1" max="100" v-model="hostVolume" />
</template>
<script>
// import { defineComponent } from "vue";
import YouTube from "vue3-youtube";
import socket from "../socket";

export default {
  components: { YouTube },
  data() {
    return {
      hostVolume: 50,
      shared: false,
    };
  },
  computed: {
    currentClipLink() {
      return this.$store.getters.currentClipLink;
    },
    roomid() {
      return this.$route.params.roomid;
    },
  },
  async created() {
    socket.auth = { room: this.roomid };
    socket.connect();
    socket.on("newuserconnected", ({ username }) => {
      console.log(`user ${username} connected to room ${this.roomid}`);
    });
    socket.on("track:play", () => {
      this.$refs.youtube.playVideo();
    });
    socket.on("track:pause", () => {
      this.$refs.youtube.pauseVideo();
    });
  },
  methods: {
    onReady() {
      this.$refs.youtube.playVideo();
    },
    async onStateChange(value) {
      switch (value.data) {
        case 0: //song ended
          await this.$store.commit("incrementCurrentIndex");
          socket.emit("track:switch", {
            playlistData: this.$store.getters.playlistData,
            to: this.roomid,
          });
          break;
        case 1: //song playing
          socket.emit("track:play", { to: this.roomid });
          break;
        case 2: //song paused
          socket.emit("track:pause", { to: this.roomid });
          break;
        case 3: //song buffering
          if (this.$store.getters.isHost) {
            socket.emit("track:pause", { to: this.roomid });
          }
          break;
        case 5: //song seek
          console.log("emit current position");
          //dupa nie dziala, to nie to
          // socket.emit("track:cue", { to: this.roomid });
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
