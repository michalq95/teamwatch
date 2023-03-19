<template>
  <div v-if="isLoggedIn">
    Welcome {{ user.name }}
    <input type="button" value="Log out" @click="logOut" />
  </div>
  <router-view />
  <!-- <iframe width="420" height="345" v-bind:src="currentClipLink"> </iframe> -->
</template>
<script>
import { mapMutations } from "vuex";

export default {
  created() {
    let user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.$store.commit("setUser", user);
    }
  },
  methods: {
    ...mapMutations(["logOut"]),
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.right {
  float: right;
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
