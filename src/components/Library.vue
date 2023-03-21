<template>
  Library {{ activeCatalog }}
  <input type="button" @click="loadLibrary()" value="load" />
  <input type="button" @click="saveLibrary()" value="save" />
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
      openedCatalogs: [],
    };
  },
  computed: {
    library: {
      get() {
        return this.$store.getters.getLibrary;
      },
      set(value) {
        this.$store.commit("setLibrary", value);
      },
    },
    activeCatalog: {
      get() {
        return this.$store.getters.getActiveCatalog;
      },
      set(value) {
        this.$store.commit("setActiveCatalog", value);
      },
    },
    roomid() {
      return this.$route.params.roomid;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
  mounted() {
    // console.log(this.library.length);
    if (this.library.length == 0) {
      console.log("no lib");
      this.loadLibrary();
    }
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
    async saveLibrary() {
      let uri = "http://localhost:5000/api/user/library";
      try {
        const res = await fetch(uri, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${this.user.token}`,
          },
          body: JSON.stringify(this.library),
        });
        const data = await res.json();
        console.log(data);
        this.library = data.data;
      } catch (e) {
        console.error(e);
      }
    },
    async loadLibrary() {
      let uri = "http://localhost:5000/api/user/library";
      try {
        const res = await fetch(uri, {
          method: "GET",
          mode: "cors",
          headers: {
            // "Content-Type": "application/json",
            authorization: `Bearer ${this.user.token}`,
          },
        });
        const data = await res.json();
        console.log(data);
        this.library = data.data;
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
