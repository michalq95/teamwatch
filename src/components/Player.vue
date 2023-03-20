<template>
  <div v-if="currentClip">
    <div class="player">
      <YouTube
        v-bind:src="currentClip.link"
        @ready="onReady"
        @stateChange="onStateChange"
        ref="youtube"
      />
      Seek:<input
        class="seek"
        type="range"
        min="0"
        :max="maxTime || 0"
        step="1"
        v-model="currentTime"
        @change="onInputRangeChange"
      />
      {{ maxTime }}
    </div>
    Shared: <input type="checkbox" v-model="shared" /> Volume:
    <input
      type="range"
      min="1"
      max="100"
      v-model="hostVolume"
      @change="volumeChange"
    />
  </div>
</template>
<script>
// import { defineComponent } from "vue";
import YouTube from "vue3-youtube";
import socket from "../socket";

export default {
  components: { YouTube },
  data() {
    return {
      currentClip: "",
      hostVolume: 50,
      shared: false,
      currentTime: 0,
      maxTime: 0,
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
      if (this.$refs.youtube.getPlayerState() == 1)
        this.$refs.youtube.pauseVideo();
    });
    socket.on("room", (data) => {
      this.$store.commit("setStatePlaylist", data.playlist);
      this.$store.commit("setIndex", data.currentIndex);
      // this.$store.commit("setCurrentVideo", data.currentVideo);
      // this.currentClip = data.currentVideo;
    });
    socket.on("track:switch", async (data) => {
      await this.$store.commit("setStatePlaylist", data.playlist);
      await this.$store.commit("setIndex", data.currentIndex);
      await this.$store.commit("setCurrentVideo", data.currentVideo);
      console.log(data.currentVideo);
      this.currentClip = data.currentVideo;

      setTimeout(() => {
        let playerstate = this.$refs.youtube.getPlayerState();
        console.log(playerstate);
        if (playerstate != 1) {
          console.log("playing video");
          this.$refs.youtube.playVideo();
          // setTimeout(() => {
          //   if (this.$refs.youtube.getPlayerState() != 1) {
          //     console.log("playing video once more, wy it has to be like this");
          //     this.$refs.youtube.playVideo();
          //   }
          // }, 1500);
        }
      }, 1500);
    });
    socket.on("track:seek", ({ seekToTime }) => {
      if (this.shared) this.$refs.youtube.seekTo(seekToTime);
    });
    socket.on("volume:change", ({ volume }) => {
      if (this.shared) this.$refs.youtube.setVolume(volume);
    });
    // this.currentClip = this.currentClipLink;
  },
  methods: {
    onReady() {
      // this.currentClip = this.currentClipLink;
      // this.currentClip = data.currentVideo;

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
          // this.currentClip = this.currentClipLink;

          break;
        case 1: //song playing
          this.maxTime = this.$refs.youtube.getDuration();
          setInterval(() => {
            this.currentTime = this.$refs.youtube.getCurrentTime();
          }, 1000);
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
          // console.log("emit current position");
          //dupa nie dziala, to nie to
          // socket.emit("track:cue", { to: this.roomid });
          break;
      }
    },
    volumeChange() {
      socket.emit("volume:change", {
        volume: this.hostVolume,
        to: this.roomid,
      });
      if (this.shared) this.$refs.youtube.setVolume(this.hostVolume);
    },
    onInputRangeChange(event) {
      const seekToTime = Number(event.target.value);
      this.$refs.youtube.seekTo(seekToTime);
      socket.emit("track:seek", { to: this.roomid, seekToTime });
    },
  },
};
</script>
<style lang="scss" scoped>
.player {
  width: 640px;
}
.seek {
  width: 640px;
}
</style>
