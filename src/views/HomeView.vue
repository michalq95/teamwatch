<template>
  <input type="text" v-model="roomName" />
  <input type="button" value="Join/Create room" @click="navigateToRoom" />
  <input type="text" v-model="username" />
</template>
<script>
export default {
  data() {
    return {
      roomName: "room",
      registerData: {},
      username: "Anonymous",
    };
  },
  methods: {
    navigateToRoom() {
      if (this.isLoggedIn) {
        this.$router.push({ name: "room", params: { roomid: this.roomName } });
      } else {
        this.$store.commit("setUser", {
          name: this.username || "Anonymous",
          token: null,
        });
        this.$router.push({
          name: "room",
          params: { roomid: this.roomName },
        });
      }
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
  mounted() {
    if (this.isLoggedIn) this.username = this.user.name;
  },
};
</script>
