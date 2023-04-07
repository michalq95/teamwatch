<template>
  <div>
    <div class="player">
      <YouTube
        v-bind:src="currentClip.link"
        @ready="onReady"
        @stateChange="onStateChange"
        width="720"
        height="405"
        ref="youtube"
      />
      <input
        class="seek"
        type="range"
        min="0"
        :max="maxTime - 0.5 || 0"
        step="1"
        v-model="currentTime"
        @change="onInputRangeChange"
      />
      <input
        type="button"
        style="width: 50px; font-weight: bolder"
        @click="playPauseVideo"
        value=">||"
      />
      <!-- <input type="button" @click="playVideo" value=">" /> -->
      Shared: <input type="checkbox" v-model="shared" /> Volume:
      <input
        type="range"
        min="1"
        max="100"
        v-model="hostVolume"
        @change="volumeChange"
      />
    </div>
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
      updateInterval: null,
      paused: false,
    };
  },
  computed: {
    currentClipLink() {
      return this.$store.getters.currentClipLink;
    },
    roomid() {
      return this.$route.params.roomid;
    },
    user() {
      return this.$store.getters.getUser;
    },
  },

  beforeUnmount() {
    try {
      clearInterval(this.updateInterval);
      socket.disconnect();
    } catch (e) {
      console.error(e);
    }
  },
  // unmounted() {
  //   this.$refs.youtube.destroy();
  //   socket.disconnect();
  // },

  methods: {
    playPauseVideo() {
      try {
        if (this.paused) {
          this.$refs.youtube.playVideo();
          socket.emit("track:play");
          this.paused = false;
        } else if (!this.paused) {
          this.$refs.youtube.pauseVideo();
          socket.emit("track:pause");
          this.paused = true;
        }
      } catch (e) {}
    },
    onReady() {
      // this.currentClip = this.currentClipLink;
      // this.currentClip = data.currentVideo;
      socket.auth = {
        room: this.roomid,
        token: this.user.token,
        name: this.user.name,
      };
      socket.connect();
      socket.on("newuserconnected", ({ username }) => {
        console.log(`user ${username} connected to room ${this.roomid}`);
      });
      socket.on("track:play", () => {
        this.$refs.youtube.playVideo();
        this.paused = false;
      });
      socket.on("track:pause", () => {
        if (this.$refs.youtube.getPlayerState() == 1) {
          this.$refs.youtube.pauseVideo();
        }
        this.paused = true;
      });
      socket.on("room", (data) => {
        console.log(data);
        this.$store.commit("setStatePlaylist", data.playlist);
        this.$store.commit("setIndex", data.currentIndex);
        // this.$store.commit("setCurrentVideo", data.currentVideo);
        // this.currentClip = data.currentVideo;
      });
      socket.on("track:switch", async (data) => {
        await this.$store.commit("setStatePlaylist", data.playlist);
        await this.$store.commit("setIndex", data.currentIndex);
        await this.$store.commit("setCurrentVideo", data.currentVideo);
        if (data.currentVideo) this.currentClip = data.currentVideo;
        // if (this.currentClip) {
        // setTimeout(() => {
        //   let playerstate = this.$refs.youtube.getPlayerState();
        //   if (playerstate != 1) {
        //     this.$refs.youtube.playVideo();
        //     // setTimeout(() => {
        //     //   if (this.$refs.youtube.getPlayerState() != 1) {
        //     //     console.log("playing video once more, wy it has to be like this");
        //     //     this.$refs.youtube.playVideo();
        //     //   }
        //     // }, 1500);
        //   }
        // }, 2000);
        // }
      });
      socket.on("track:seek", ({ seekToTime }) => {
        if (this.shared) this.$refs.youtube.seekTo(seekToTime);
      });
      socket.on("volume:change", ({ volume }) => {
        this.hostVolume = volume;
        if (this.shared) this.$refs.youtube.setVolume(volume);
      });
      socket.on("blocked", () => {
        // console.log("blocked");
      });
      this.$refs.youtube.playVideo();
      this.updateInterval = setInterval(() => {
        this.currentTime = this.$refs.youtube.getCurrentTime();
      }, 1000);
    },
    async onStateChange(value) {
      // console.log(value.data);
      switch (value.data) {
        case 0: //song ended
          console.log(this.currentClip);
          console.log(this.currentClip.idIndex);
          socket.emit("track:next", {
            currentIdIndex: this.currentClip.idIndex,
          });
          // await this.$store.commit("incrementCurrentIndex");
          // socket.emit("track:switch", {
          // playlistData: this.$store.getters.playlistData,
          // });
          // }
          // this.currentClip = this.currentClipLink;

          break;
        case 1: //song playing
          this.maxTime = this.$refs.youtube.getDuration();
          // if (this.paused) socket.emit("track:play");
          this.paused = false;
          break;
        case 2: //song paused
          // if (!this.paused) socket.emit("track:pause");
          this.paused = true;
          break;
        case 3: //song buffering
          break;
        case 5: //song seek
          // console.log("emit current position");
          //dupa nie dziala, to nie to
          // socket.emit("track:cue");
          break;
      }
    },
    volumeChange() {
      socket.emit("volume:change", {
        volume: this.hostVolume,
      });
      if (this.shared) this.$refs.youtube.setVolume(this.hostVolume);
    },
    onInputRangeChange(event) {
      const seekToTime = Number(event.target.value);
      this.$refs.youtube.seekTo(seekToTime);
      socket.emit("track:seek", { seekToTime });
    },
  },
};
</script>
<style lang="scss" scoped>
.player {
  width: 720px;
}
.seek {
  width: 720px;
}
</style>
