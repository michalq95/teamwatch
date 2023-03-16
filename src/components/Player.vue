<template>
  <YouTube
    v-bind:src="currentClipLink"
    @ready="onReady"
    @stateChange="onStateChange"
    ref="youtube"
  />
  <input type="range" min="1" max="100" v-model="hostVolume" />
</template>
<script>
// import { defineComponent } from "vue";
import YouTube from "vue3-youtube";

export default {
  components: { YouTube },
  data() {
    return {
      hostVolume: 50,
    };
  },
  computed: {
    currentClipLink() {
      return this.$store.getters.currentClipLink;
    },
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
