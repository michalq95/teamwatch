<template>
  <div class="room">
    <Player class="comp1 comp"></Player>
    <Playlist class="comp2 comp"></Playlist>
    <div v-if="isLoggedIn">
      <Library class="comp3 comp"></Library>
    </div>
    <Search class="comp4 comp"></Search>
    <Chat></Chat>
  </div>
</template>

<script>
import Playlist from "../components/Playlist.vue";
import Player from "../components/Player.vue";
import Library from "../components/Library.vue";
import Search from "../components/Search.vue";
import Chat from "../components/Chat.vue";

export default {
  name: "RoomView",
  components: {
    Player,
    Playlist,
    Library,
    Search,
    Chat,
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1122px) {
  .room {
    position: relative;
    // left: 50%;
    // transform: translateX(-50%);
    .comp1 {
      position: absolute;
      top: 10px;
      width: 730px;
      left: calc(90vw - 660px);
    }
    .comp2 {
      position: absolute;
      height: 440px;
      width: calc(90vw - 680px);
    }
    .comp3 {
      position: absolute;
      max-height: 700px;
      width: 45vw;

      top: 490px;
    }
    .comp4 {
      position: absolute;
      max-height: 700px;
      top: 490px;
      width: 45vw;

      left: 50vw;
    }
    .comp {
      // flex: 50%;
      margin: 10px;
    }
  }
}
@media screen and (max-width: 1121px) {
  .room {
    display: flex;

    margin: 30px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .comp {
      flex: 50%;
      width: 90vw;
    }
    .comp2 {
      max-height: 440px;
    }
  }
}
</style>
