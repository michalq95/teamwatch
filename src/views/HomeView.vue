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
  <div v-if="errorRoomPassword" style="color: crimson">
    Room already exists and you provided wrong password
  </div>
  <div v-if="errorRoomName && !roomName" style="color: crimson">
    Please provide room name
  </div>
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
      errorRoomPassword: null,
      errorRoomName: null,
    };
  },
  methods: {
    async navigateToRoom() {
      if (this.roomName) {
        let uri = `${process.env.VUE_APP_BACKEND_URL}api/user/room`;
        try {
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
                id: null,
              });
              this.$router.push({
                name: "room",
                params: { roomid: this.roomName },
              });
            }
          } else {
            this.errorRoomPassword = setTimeout(() => {
              this.errorRoomPassword = null;
            }, 10000);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        this.errorRoomName = setTimeout(() => {
          this.errorRoomName = null;
        }, 10000);
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
