<template>
  <router-view /> -->
  <!-- <iframe width="420" height="345" v-bind:src="currentClipLink"> </iframe> -->
  <Player></Player>
  <div class="right">
    <Playlist></Playlist>
  </div>
</template>
<script>
import Playlist from "./components/Playlist.vue";
import Player from "./components/Player.vue";

export default {
  components: { Player, Playlist },
  computed: {
    currentClipLink() {
      return this.$store.getters.currentClipLink;
    },
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.right {
  float: right;
}
nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
