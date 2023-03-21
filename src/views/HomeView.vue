<template>
  <input type="text" v-model="roomName" />
  <input type="button" value="Join/Create room" @click="navigateToRoom" />
  <!-- <div v-if="!isLoggedIn">
    Login:
    <form @submit.prevent="login">
      <input
        class="login logininput"
        v-model="loginData.name"
        placeholder="name"
      />

      <input
        class="login logininput"
        v-model="loginData.password"
        placeholder="password"
        type="password"
      />
      <button class="login" @click="loginMe" type="submit">Login</button>
    </form>
    Register:
    <form @submit.prevent="login">
      <input
        class="login logininput"
        v-model="registerData.name"
        placeholder="name"
      />
      <input
        class="login logininput"
        v-model="registerData.email"
        placeholder="email"
        type="email"
      />
      <input
        class="login logininput"
        v-model="registerData.password"
        placeholder="password"
        type="password"
      />
      <button class="login" @click="registerMe" type="submit">Register</button>
    </form>
  </div> -->
</template>
<script>
export default {
  data() {
    return {
      roomName: "room",
      registerData: {},
    };
  },
  methods: {
    navigateToRoom() {
      this.$router.push({ name: "room", params: { roomid: this.roomName } });
    },

    async registerMe() {
      if (
        this.registerData.password &&
        this.registerData.name &&
        this.registerData.email
      ) {
        let uri = "http://localhost:5000/api/user/register";
        try {
          const res = await fetch(uri, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.registerData),
          });

          const data = await res.json();
          if (data.success) {
            let jsonstring = JSON.stringify({
              name: data.user.name,
              token: data.token,
            });
            localStorage.setItem("user", jsonstring);
            console.log(jsonstring);
            // localStorage.setItem("token", data.token);

            this.$store.commit("setUser", {
              name: data.user.name,
              token: data.token,
            });
          }
        } catch (e) {
          this.unsuccesful = true;
          console.error(e);
        }
      }
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>
