<template>
  <header>
    <nav class="container">
      <div class="branding">
        <router-link class="header" to="/">Home</router-link>
      </div>
      <div class="nav-links">
        <form @submit.prevent="login" v-if="!isLoggedIn">
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
        <div v-else>Welcome {{ user.name }}</div>
        <ul>
          <!-- <router-link class="link" to="{ name: 'Home' }">Home</router-link> -->
          <router-link v-if="!isLoggedIn" class="link" to="/register"
            >Register</router-link
          >
          <input v-else type="button" value="Log out" @click="logOut" />
        </ul>
      </div>
    </nav>
  </header>
</template>
<script>
import { mapMutations } from "vuex";

export default {
  name: "Navigation",
  data() {
    return {
      loginData: {},
      unsuccesful: false,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    ...mapMutations(["logOut"]),
    navigateToRoom() {
      this.$router.push({ name: "room", params: { roomid: this.roomName } });
    },
    async loginMe() {
      if (this.loginData.password && this.loginData.name) {
        let uri = "http://localhost:5000/api/user/login";
        try {
          const res = await fetch(uri, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.loginData),
          });

          const data = await res.json();
          if (data.success) {
            let jsonstring = JSON.stringify({
              name: data.user.name,
              token: data.token,
            });
            localStorage.setItem("user", jsonstring);
            console.log(jsonstring);

            this.$store.commit("setUser", {
              name: data.user.name,
              token: data.token,
            });
            this.$store.commit("setLibrary", data.user.playlists);
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
<style lang="scss" scoped>
header {
  background-color: #12151b;
  padding: 0 25px;
  z-index: 99;
  .link {
    font-weight: 500;
    padding: 0 8px;
    transition: 0.3s color ease;
    color: rgb(182, 182, 247);

    &:hover {
      color: rgb(196, 196, 240);
    }
  }
  nav {
    display: flex;
    padding: 25px 0;

    .branding {
      display: flex;
      align-items: center;
      .header {
        font-weight: 600;
        font-size: 24px;
        color: rgb(168, 167, 230);
        text-decoration: none;
      }
    }
    .nav-links {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      ul {
        margin-right: 32px;

        .link {
          margin-right: 32px;
        }
        .link:last-child {
          margin-right: 0;
        }
      }
      .login {
        background-color: rgb(17, 26, 29);
        border-radius: 5px;
        border-color: dimgrey;
        color: dimgrey;
      }
    }
  }
}
</style>
