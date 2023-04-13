<template>
  <div>
    Room:
    <input class="textinput" type="text" v-model="roomName" />
  </div>
  <div v-if="!isLoggedIn">
    Username:
    <input class="textinput" type="text" v-model="username" />
  </div>
  <div>
    Room Password:
    <input class="textinput" type="text" v-model="password" />
  </div>
  <input
    class="button"
    type="button"
    value="Join the Room"
    @click="navigateToRoom"
  />
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      roomName: "room",
      registerData: {},
      username: "Anonymous",
      password: "aaa",
    };
  },
  methods: {
    async navigateToRoom() {
      let uri = `${process.env.VUE_APP_BACKEND_URL}api/user/room`;
      try {
        console.log(uri);

        const res = await axios.post(
          uri,
          {
            room: this.roomName,
            password: this.password,
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        console.log(res);
        if (res.status === 200) {
          this.$store.commit("setRoomPassword", this.password);
          if (this.isLoggedIn) {
            this.$router.push({
              name: "room",
              params: { roomid: this.roomName },
            });
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
        } else {
          console.log("wrong password to the room");
        }
      } catch (e) {
        console.error(e);
      }
      console.log("aa");
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
<style lang="scss" scoped>
div {
  font-size: large;
  font-weight: 800;
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
}
</style>
