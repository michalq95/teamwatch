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
  </div>
  <div v-else>
    <router-link class="header" to="/"
      >An error occured, go back to homepage</router-link
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      roomName: "room",
      registerData: {},
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
          const res = await fetch(uri, {
            method: "POST",
            mode: "cors",
            headers: {
              // Accept: "application/json, text/plain, */*",
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
            // localStorage.setItem("token", data.token);

            this.$store.commit("setUser", {
              name: data.user.name,
              token: data.token,
            });
            this.$router.push({ name: "home" });
          }
        } catch (e) {
          this.unsuccesful = true;
          console.error(e);
        }
      }
    },
  },
};
</script>
