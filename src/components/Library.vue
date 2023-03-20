<template>
  Library {{ activeCatalog }}

  <div
    v-for="(catalog, index) in library"
    :key="index"
    @click="activeCatalog = index"
  >
    {{ catalog.name }}
    <input type="button" @click="openCloseCatalog(index)" value="open" />
    <div
      v-if="openedCatalogs.includes(index)"
      v-for="(video, index2) in catalog.playlist"
      :key="index2"
    >
      {{ video.name }}
      <input type="button" @click="addToPlaylist(video)" value="add" />
    </div>
  </div>
</template>
<script>
import socket from "../socket";

export default {
  name: "Library",
  data() {
    return {
      library: [
        {
          name: "rock",
          playlist: [
            {
              name: "Bardzo długa nazwa Bardzo długa nazwa Bardzo długa nazwa Bardzo długa nazwa Bardzo długa nazwa Bardzo długa nazwa Bardzo długa nazwa Bardzo długa nazwa Bardzo długa nazwa ",
              link: "https://www.youtube.com/watch?v=VHsLQ3Dzb_k",
            },
            {
              name: "Sentinel",
              link: "https://www.youtube.com/watch?v=8Ksksu9JDkg",
            },
          ],
        },
        {
          name: "śmieszne rzeczy",
          playlist: [
            {
              name: "Brzuch boli",
              link: "https://www.youtube.com/watch?v=Va6prfeTC5Q",
            },
            {
              name: "oof",
              link: "https://www.youtube.com/watch?v=YTC75cKzuNk",
            },
          ],
        },
      ],
      openedCatalogs: [],
    };
  },
  computed: {
    // library() {
    //   return this.$store.getters.getLibrary;
    // },
    activeCatalog: {
      get() {
        return this.$store.getters.getActiveCatalog;
      },
      set(value) {
        console.log("aaa" + value);
        this.$store.commit("setActiveCatalog", value);
      },
    },
    roomid() {
      return this.$route.params.roomid;
    },
  },
  methods: {
    openCloseCatalog(index) {
      if (this.openedCatalogs.includes(index)) {
        this.openedCatalogs = this.openedCatalogs.filter((el) => {
          el !== index;
        });
      } else {
        this.openedCatalogs.push(index);
      }
    },
    addToPlaylist(video) {
      socket.emit("track:add", {
        video: video.link,
        videoName: video.name,
        to: this.roomid,
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
