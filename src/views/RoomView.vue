<template>
  <div class="room">
    <Player></Player>
    <Playlist></Playlist>
    <div v-if="isLoggedIn">
      <Library></Library>
    </div>
  </div>
</template>

<script>
import Playlist from "../components/Playlist.vue";
import Player from "../components/Player.vue";
import Library from "../components/Library.vue";

export default {
  name: "RoomView",
  components: { Player, Playlist, Library },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>
