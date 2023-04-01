<template>
  <Navigation></Navigation>
  <!-- <div v-if="isLoggedIn">
    Welcome {{ user.name }}
    <input type="button" value="Log out" @click="logOut" />
  </div> -->
  <router-view />
  <!-- <iframe width="420" height="345" v-bind:src="currentClipLink"> </iframe> -->
</template>
<script>
import Navigation from "./components/Navigation.vue";

export default {
  components: { Navigation },
  created() {
    let user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.$store.commit("setUser", user);
    }
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
};
</script>
<style lang="scss">
body {
  margin: 0;
  background-color: #2c3e50;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #aacbec;
  background-color: rgb(43, 61, 79);
  input {
    background-color: #172029;
    color: #aacbec;
    // text-align: center;
    border-radius: 5px;
    border-color: #2c3e50;
  }
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
