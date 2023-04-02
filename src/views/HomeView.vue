<template>
  <h3>
    Room:
    <input class="textinput" type="text" v-model="roomName" />
  </h3>
  <h3 v-if="!isLoggedIn">
    Username:
    <input class="textinput" type="text" v-model="username" />
  </h3>
  <input
    class="button"
    type="button"
    value="Join the Room"
    @click="navigateToRoom"
  />
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
<style scoped lang="scss">
.textinput {
  height: 30px;
  width: 300px;
  border-radius: 8px;
  color: rgb(172, 172, 189);
}
.button {
  height: 30px;
  border-radius: 8px;
  color: rgb(172, 172, 189);
  margin-bottom: 5px;
  margin-right: 5px;
  font-weight: 700;
}
</style>
