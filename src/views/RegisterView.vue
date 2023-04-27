<template>
  <div v-if="!isLoggedIn">
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
    <div v-if="errorData" style="color: crimson">
      Please provide name, email and password
    </div>
    <div v-if="errorName" style="color: crimson">
      User with this name is already registered
    </div>
    <div v-if="errorEmail" style="color: crimson">
      User with this email is already registered
    </div>
  </div>
  <div v-else>
    <router-link class="header" to="/"
      >An error occured, go back to homepage</router-link
    >
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      roomName: "room",
      registerData: {},
      errorData: null,
      errorName: null,
      errorEmail: null,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {
    async registerMe() {
      if (
        this.registerData.password &&
        this.registerData.name &&
        this.registerData.email
      ) {
        let uri = `${process.env.VUE_APP_BACKEND_URL}api/user/register`;
        try {
          const res = await axios.post(uri, this.registerData, {
            withCredentials: true,
          });
          const data = res.data;
          let jsonstring = JSON.stringify({
            name: data.user.name,
            token: data.token,
          });
          localStorage.setItem("user", jsonstring);
          this.$store.commit("setUser", {
            name: data.user.name,
            token: data.token,
            id: data.user.id,
          });
          this.$router.push({ name: "home" });
        } catch (e) {
          if (e.response.status == 401) {
            this.errorName = setTimeout(() => {
              this.errorName = null;
            }, 10000);
          } else if (e.response.status == 403) {
            this.errorEmail = setTimeout(() => {
              this.errorEmail = null;
            }, 10000);
          } else {
            this.errorData = setTimeout(() => {
              this.errorData = null;
            }, 10000);
          }
        }
      } else {
        this.errorData = setTimeout(() => {
          this.errorData = null;
        }, 10000);
      }
    },
  },
};
</script>
