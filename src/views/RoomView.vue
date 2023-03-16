<template>
  <div class="room">
    <Player></Player>
    <div class="right">
      <Playlist></Playlist>
    </div>
  </div>
</template>

<script>
import Playlist from "../components/Playlist.vue";
import Player from "../components/Player.vue";

export default {
  name: "RoomView",
  components: { Player, Playlist },
};
</script>
