<template>
  <div class="room">
    <Player class="comp"></Player>
    <Playlist class="comp"></Playlist>
    <div v-if="isLoggedIn">
      <Library class="comp"></Library>
    </div>
    <Search class="comp"></Search>
  </div>
</template>

<script>
import Playlist from "../components/Playlist.vue";
import Player from "../components/Player.vue";
import Library from "../components/Library.vue";
import Search from "../components/Search.vue";

export default {
  name: "RoomView",
  components: { Player, Playlist, Library, Search },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>
<style lang="scss" scoped>
.room {
  display: flex;
  flex-wrap: wrap;

  .comp {
    flex: 50%;
  }
}
@media screen and (max-width: 992px) {
  .room {
    flex-direction: column;
  }
}
</style>
