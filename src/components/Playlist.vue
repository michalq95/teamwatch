<template>
  <div class="playlistcomponent">
    <div>
      <input type="text" v-model="videoRef" placeholder="link to video" />
      <input type="text" v-model="videoName" placeholder="video name" />
      <input type="button" @click="addTrack" value="Add Video" />
      {{ currentIndex }}
    </div>

    <!-- <ul v-for="(clip, index) in playlist" v-bind:key="clip.name + '_' + index">
      {{
        clip.name
      }}
      <input type="button" @click="setCurrent(index)" value="play" />
    </ul> -->
    {{ playlist }}

    <draggable
      class="list"
      v-model="playlist"
      @start="drag = true"
      @end="drag = false"
      @change="playlistReorder"
      item-key="name"
    >
      <template #item="{ element, index }">
        <div class="listelement">
          <span>{{ element.name }}</span>
          <input type="button" @click="setCurrent(index)" value="play" />
        </div>
      </template>
    </draggable>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import socket from "../socket";

export default {
  name: "Playlist",
  components: { draggable },
  data() {
    return {
      videoName: "",
      videoRef: "",
    };
  },
  computed: {
    playlist: {
      get() {
        return this.$store.getters.getPlaylist;
      },
      set(value) {
        this.$store.commit("setStatePlaylist", value);
      },
    },
    roomid() {
      return this.$route.params.roomid;
    },
    currentIndex() {
      return this.$store.getters.getCurrentIndex;
    },
  },
  methods: {
    setCurrent(index) {
      this.$store.commit("setIndex", index);
      socket.emit("track:switch", {
        playlistData: this.$store.getters.playlistData,
        to: this.roomid,
      });
    },
    addTrack() {
      socket.emit("track:add", {
        video: this.videoRef,
        videoName: this.videoName,
        to: this.roomid,
      });
    },
    playlistReorder(item) {
      console.log(item.moved);
      if (item.moved.oldIndex == this.currentIndex) {
        this.$store.commit("setIndex", item.moved.newIndex);
      } else if (item.moved.newIndex == this.currentIndex) {
        this.$store.commit("setIndex", item.moved.oldIndex);
      }

      socket.emit("track:switch", {
        playlistData: this.$store.getters.playlistData,
        to: this.roomid,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.playlistcomponent {
  position: fixed;
  right: 0;
  top: 0;
  width: 500px;
}
.list {
  display: flex;
  height: 700px;
  width: 300px;
  flex-direction: column;
  background-color: rgb(139, 209, 209);

  .listelement {
    border: 2px solid black;
    border-radius: 5px;
    width: 280px;
    height: 30px;
    margin: auto;
    justify-content: left;
    align-items: center;
    align-content: flex-start;
  }
}
</style>
