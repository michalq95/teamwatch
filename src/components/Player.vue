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
  },
  methods: {
    onReady() {
      this.$refs.youtube.playVideo();
    },
    onStateChange(value) {
      switch (value.data) {
        case 0: //song ended
          this.$store.commit("incrementCurrentIndex");
          break;
        case 1: //song playing
          console.log("emit play");
          break;
        case 2: //song paused
          console.log("emit pause");
          break;
        case 3: //song buffering
          if (this.$store.getters.isHost) console.log("emit pause?");
          break;
        case 5: //song buffering
          console.log("emit current position");
          break;
      }
      console.log("state changed " + value.data);
    },
  },
};
</script>
<style lang="scss" scoped></style>
